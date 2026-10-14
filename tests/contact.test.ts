import { describe, it, expect, vi, beforeEach } from "vitest";

const sendMail = vi.fn(async (_opts: Record<string, unknown>) => ({ accepted: [] as string[] }));
vi.mock("@/lib/smtp", () => ({
  getTransporter: vi.fn(async () => ({ sendMail })),
  mailFrom: () => "Nousdev <no-reply@localhost>",
}));

import { POST } from "@/app/api/contact/route";

// IP unique par appel : la limitation de débit est en mémoire et partagée
// dans le processus — sans ça, les tests se bloqueraient entre eux.
let ipSeq = 0;
const post = (body: unknown, ip = `203.0.113.${++ipSeq}`) =>
  POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );

const valid = {
  name: "Jean Dupont",
  email: "jean@example.com",
  tel: "+33 6 12 34 56 78",
  projet: "Site vitrine",
  budget: "2 000 – 5 000 €",
  delai: "Dans 1 mois",
  message: "Bonjour, je souhaite discuter d'un projet de site vitrine.",
};

beforeEach(() => {
  sendMail.mockClear();
  // Configuration e-mail présente (sinon la route répond 500 mail_not_configured).
  process.env.CONTACT_TO_EMAIL = "contact@nousdev.test";
  process.env.SMTP_HOST = "smtp.test";
});

describe("POST /api/contact", () => {
  it("accepte un message valide et renvoie un ticket NSD-XXXX", async () => {
    const res = await post(valid);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.ticket).toMatch(/^NSD-[0-9A-F]{4}$/);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it("accepte les champs facultatifs vides (téléphone, budget, délai)", async () => {
    const res = await post({
      name: "Jean",
      email: "jean@example.com",
      tel: "",
      projet: "Vitrine",
      budget: "",
      delai: "",
      message: "Un message assez long pour passer la validation.",
    });
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });

  it("refuse un téléphone renseigné mais trop court", async () => {
    const res = await post({ ...valid, tel: "123" });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_tel");
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("refuse un sujet trop court", async () => {
    const res = await post({ ...valid, projet: "x" });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_projet");
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("n'envoie jamais le destinataire au client", async () => {
    const res = await post(valid);
    const text = JSON.stringify(await res.json());
    expect(text).not.toContain("contact@nousdev.test");
  });

  it("répond ok sans rien envoyer quand le honeypot est rempli", async () => {
    const res = await post({ ...valid, website: "http://spam.example" });
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("refuse un nom vide", async () => {
    const res = await post({ ...valid, name: "   " });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_name");
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("refuse un nom de plus de 80 caractères", async () => {
    const res = await post({ ...valid, name: "a".repeat(81) });
    expect((await res.json()).error).toBe("invalid_name");
  });

  it("refuse un e-mail invalide", async () => {
    const res = await post({ ...valid, email: "bad" });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_email");
  });

  it("refuse un message trop court", async () => {
    const res = await post({ ...valid, message: "court" });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_message");
  });

  it("refuse un message de plus de 2000 caractères", async () => {
    const res = await post({ ...valid, message: "a".repeat(2001) });
    expect((await res.json()).error).toBe("invalid_message");
  });

  it("rejette un corps non-JSON", async () => {
    const res = await post("{pas-du-json");
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("invalid_json");
  });

  it("limite à 5 envois par heure et par IP", async () => {
    const ip = "198.51.100.99";
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) statuses.push((await post(valid, ip)).status);

    expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
    expect(statuses[5]).toBe(429);
    // Une autre IP n'est pas impactée.
    expect((await post(valid, "198.51.100.100")).status).toBe(200);
  });

  it("répond 502 quand l'envoi SMTP échoue", async () => {
    sendMail.mockRejectedValueOnce(new Error("connection refused"));
    const res = await post(valid);
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe("mail_failed");
  });

  it("répond 500 mail_not_configured sans destinataire", async () => {
    delete process.env.CONTACT_TO_EMAIL;
    delete process.env.MAIL_TO;
    delete process.env.SMTP_USER;
    const res = await post(valid);
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("mail_not_configured");
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("utilise replyTo = e-mail du visiteur", async () => {
    await post(valid);
    expect(sendMail.mock.calls[0][0]).toMatchObject({ replyTo: valid.email });
  });
});
