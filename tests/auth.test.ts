/**
 * Tests de src/lib/admin/auth.ts — authentification admin.
 */
import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  createSessionToken,
  verifyPassword,
  verifySessionToken,
} from "@/lib/admin/auth";
import { TEST_PASSWORD } from "./setup";

describe("verifyPassword", () => {
  it("accepte le bon mot de passe", () => {
    expect(verifyPassword(TEST_PASSWORD)).toBe(true);
  });

  it("refuse un mauvais mot de passe", () => {
    expect(verifyPassword("mauvais")).toBe(false);
    expect(verifyPassword("")).toBe(false);
    expect(verifyPassword(TEST_PASSWORD + "x")).toBe(false);
  });

  it("refuse si le hachage n'est pas au format scrypt", () => {
    const original = process.env.ADMIN_PASSWORD_HASH;
    process.env.ADMIN_PASSWORD_HASH = "md5:abcdef";
    expect(verifyPassword(TEST_PASSWORD)).toBe(false);
    process.env.ADMIN_PASSWORD_HASH = original;
  });
});

describe("jetons de session", () => {
  it("un jeton créé est valide", () => {
    const token = createSessionToken();
    expect(verifySessionToken(token)).toBe(true);
  });

  it("refuse un jeton absent ou malformé", () => {
    expect(verifySessionToken(undefined)).toBe(false);
    expect(verifySessionToken(null)).toBe(false);
    expect(verifySessionToken("")).toBe(false);
    expect(verifySessionToken("payload-sans-signature")).toBe(false);
  });

  it("refuse un jeton falsifié", () => {
    const token = createSessionToken();
    const [payload, sig] = token.split(".");
    const forged = `${payload}.${sig.slice(0, -2)}${sig.at(-2) === "A" ? "BB" : "AA"}`;
    expect(verifySessionToken(forged)).toBe(false);
  });

  it("refuse un payload échangé contre une signature valide", () => {
    // Attaque classique : réutiliser la signature d'un jeton légitime sur un autre payload.
    const token = createSessionToken();
    const [payload, sig] = token.split(".");
    const otherPayload = Buffer.from(JSON.stringify({ exp: Date.now() + 9_999_999 })).toString("base64url");
    expect(verifySessionToken(`${otherPayload}.${sig}`)).toBe(false);
    expect(payload).not.toBe(otherPayload);
  });

  it("refuse un jeton expiré", () => {
    const payload = Buffer.from(JSON.stringify({ exp: Date.now() - 1000 })).toString("base64url");
    const sig = createHmac("sha256", process.env.ADMIN_SESSION_SECRET!)
      .update(payload)
      .digest("base64url");
    expect(verifySessionToken(`${payload}.${sig}`)).toBe(false);
  });

  it("refuse un jeton signé avec un autre secret", () => {
    const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 60_000 })).toString("base64url");
    const sig = createHmac("sha256", "autre-secret-completement-different-0000")
      .update(payload)
      .digest("base64url");
    expect(verifySessionToken(`${payload}.${sig}`)).toBe(false);
  });
});
