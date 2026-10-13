import { afterEach, describe, expect, it } from "vitest";
import { mailFrom } from "@/lib/smtp";

/** Simule la vraie corruption observée dans .env.local (ligne fusionnée). */
const CORROMPU = '"Nousdev <franckarmelettien@gmail.com>"   ADMIN_SESSION_SECRET=32cdd916c93c4ada';

describe("mailFrom — expéditeur sûr", () => {
  afterEach(() => {
    delete process.env.MAIL_FROM;
  });

  it("accepte une adresse simple valide", () => {
    process.env.MAIL_FROM = "no-reply@nousdev.com";
    expect(mailFrom()).toBe("no-reply@nousdev.com");
  });

  it("accepte la forme Nom <adresse>", () => {
    process.env.MAIL_FROM = "Nousdev <no-reply@nousdev.com>";
    expect(mailFrom()).toBe("Nousdev <no-reply@nousdev.com>");
  });

  it("répare une valeur fusionnée en conservant l'adresse réelle", () => {
    process.env.MAIL_FROM = CORROMPU;
    expect(mailFrom()).toBe("Nousdev <franckarmelettien@gmail.com>");
  });

  it("retombe sur une adresse valide si MAIL_FROM est vide", () => {
    process.env.MAIL_FROM = "";
    expect(mailFrom()).toMatch(/<[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+>$/);
  });

  it("retombe sur une adresse valide si MAIL_FROM est absent", () => {
    expect(mailFrom()).toMatch(/<[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+>$/);
  });
});
