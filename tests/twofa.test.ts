/**
 * Tests de src/lib/admin/twofa.ts — double authentification par e-mail.
 * Base SQLite temporaire fournie par tests/setup.ts (jamais data/portfolio.db).
 */
import { describe, expect, it } from "vitest";
import { createChallenge, verifyChallenge, twoFactorEmail, maskEmail } from "@/lib/admin/twofa";
import { db, initDb } from "@/lib/db";

describe("twoFactorEmail / maskEmail", () => {
  it("désactive la2FA sans adresse configurée", () => {
    const keys = ["ADMIN_2FA_EMAIL", "MAIL_TO", "SMTP_USER"] as const;
    const backup = keys.map((k) => [k, process.env[k]] as const);
    keys.forEach((k) => delete process.env[k]);
    expect(twoFactorEmail()).toBeNull();
    backup.forEach(([k, v]) => {
      if (v !== undefined) process.env[k] = v;
    });
  });

  it("retourne ADMIN_2FA_EMAIL quand il est renseigné", () => {
    process.env.ADMIN_2FA_EMAIL = "admin@example.com";
    expect(twoFactorEmail()).toBe("admin@example.com");
    delete process.env.ADMIN_2FA_EMAIL;
  });

  it("masque l'adresse pour l'affichage client", () => {
    expect(maskEmail("franck@gmail.com")).toBe("f*****@gmail.com");
    expect(maskEmail("ab@x.co")).toBe("a**@x.co");
  });
});

describe("défis de vérification", () => {
  it("accepte le bon code une seule fois", async () => {
    const { id, code } = await createChallenge();
    expect(code).toMatch(/^[0-9]{6}$/);
    expect(await verifyChallenge(id, code)).toBe("ok");
    // Usage unique : la seconde tentative est refusée (défi consommé).
    expect(await verifyChallenge(id, code)).toBe("expired");
  });

  it("refuse un mauvais code et verrouille après5 tentatives", async () => {
    const { id, code } = await createChallenge();
    expect(await verifyChallenge(id, "000000")).toBe(
      code === "000000" ? "ok" : "invalid" // collision astronomiquement improbable
    );
    // Défi précédent peut avoir été consommé par la collision : on en crée un propre.
    const fresh = await createChallenge();
    const wrong = fresh.code === "111111" ? "222222" : "111111";
    for (let i = 1; i < 5; i++) {
      expect(await verifyChallenge(fresh.id, wrong)).toBe("invalid");
    }
    expect(await verifyChallenge(fresh.id, wrong)).toBe("locked");
    // Une fois verrouillé, même le bon code est refusé.
    expect(await verifyChallenge(fresh.id, fresh.code)).toBe("locked");
  });

  it("refuse un code expiré", async () => {
    const { id, code } = await createChallenge();
    await initDb();
    await db().execute({
      sql: "UPDATE admin_challenges SET expires_at = ? WHERE id = ?",
      args: [Date.now() - 1000, id],
    });
    expect(await verifyChallenge(id, code)).toBe("expired");
  });

  it("refuse un défi inconnu ou un format invalide", async () => {
    expect(await verifyChallenge("id-inexistant", "123456")).toBe("invalid");
    expect(await verifyChallenge("id-inexistant", "12ab56")).toBe("invalid");
    expect(await verifyChallenge("id-inexistant", "12345")).toBe("invalid");
  });
});
