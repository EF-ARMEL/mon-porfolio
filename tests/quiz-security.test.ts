/**
 * Tests de src/lib/quiz/security.ts — normalisation, email, jetons, rate-limit.
 */
import { describe, expect, it } from "vitest";
import {
  clientIp,
  isEmail,
  isUsed,
  markUsed,
  normalize,
  rateLimit,
  signToken,
  verifyToken,
} from "@/lib/quiz/security";

describe("normalize", () => {
  it("minuscules, sans accents ni ponctuation", () => {
    expect(normalize(" Franck! ")).toBe("franck");
    expect(normalize("François-David")).toBe("francoisdavid");
    expect(normalize("NÖUSDEV")).toBe("nousdev");
  });

  it("réponses différenciées", () => {
    expect(normalize("franck")).not.toBe(normalize("francky"));
  });
});

describe("isEmail", () => {
  it("valide les emails corrects", () => {
    expect(isEmail("a@b.co")).toBe(true);
    expect(isEmail("franck@example.com")).toBe(true);
  });

  it("rejette les emails invalides", () => {
    expect(isEmail("")).toBe(false);
    expect(isEmail("pas-un-email")).toBe(false);
    expect(isEmail("a@b")).toBe(false);
    expect(isEmail("a b@c.com")).toBe(false);
    expect(isEmail(`${"a".repeat(250)}@b.co`)).toBe(false);
  });
});

describe("clientIp", () => {
  it("prend la première IP de x-forwarded-for", () => {
    const req = new Request("http://x", { headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } });
    expect(clientIp(req)).toBe("1.2.3.4");
  });

  it("retombe sur x-real-ip puis 'local'", () => {
    const real = new Request("http://x", { headers: { "x-real-ip": "9.9.9.9" } });
    expect(clientIp(real)).toBe("9.9.9.9");
    expect(clientIp(new Request("http://x"))).toBe("local");
  });
});

describe("jetons de récompense", () => {
  it("signer puis vérifier", () => {
    const token = signToken();
    const payload = verifyToken(token);
    expect(payload).not.toBeNull();
    expect(typeof payload?.n).toBe("string");
  });

  it("chaque jeton est unique (usage unique)", () => {
    expect(signToken().split(".")[0]).not.toBe(signToken().split(".")[0]);
  });

  it("refuse un jeton falsifié", () => {
    const token = signToken();
    const [payload, sig] = token.split(".");
    const forged = `${payload}.${sig.slice(0, -2)}${sig.at(-2) === "A" ? "BB" : "AA"}`;
    expect(verifyToken(forged)).toBeNull();
  });

  it("refuse un jeton expiré", () => {
    const token = signToken(-1000);
    expect(verifyToken(token)).toBeNull();
  });

  it("refuse un jeton malformé", () => {
    expect(verifyToken("sans-point")).toBeNull();
    expect(verifyToken("")).toBeNull();
  });
});

describe("usage unique", () => {
  it("marque puis détecte un jeton utilisé", () => {
    expect(isUsed("n-1")).toBe(false);
    markUsed("n-1");
    expect(isUsed("n-1")).toBe(true);
  });
});

describe("rateLimit", () => {
  it("autorise max requêtes puis bloque dans la fenêtre", () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    expect(rateLimit(key, 2, 1000)).toBe(true);
    expect(rateLimit(key, 2, 1000)).toBe(true);
    expect(rateLimit(key, 2, 1000)).toBe(false);
  });

  it("se réinitialise après la fenêtre", async () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    expect(rateLimit(key, 1, 50)).toBe(true);
    expect(rateLimit(key, 1, 50)).toBe(false);
    await new Promise((r) => setTimeout(r, 60));
    expect(rateLimit(key, 1, 50)).toBe(true);
  });
});
