import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Authentification admin : un seul compte.
 *
 * - Mot de passe haché avec scrypt (jamais en clair). Générer le hachage avec :
 *     node scripts/hash-password.mjs "mon-mot-de-passe"
 *   puis ADMIN_PASSWORD_HASH="<résultat>" dans .env.local (et Vercel).
 * - Session : cookie httpOnly signé HMAC (pas de dépendance externe).
 */

export const SESSION_COOKIE = "nd_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 jours

function sessionSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET manquant ou trop court (32 caractères minimum).");
  }
  return s;
}

/** Vérifie le mot de passe saisi contre ADMIN_PASSWORD_HASH (format scrypt:hash de scripts/hash-password.mjs). */
export function verifyPassword(entered: string): boolean {
  const expected = process.env.ADMIN_PASSWORD_HASH;
  if (!expected) return false;
  const [scheme, hashHex] = expected.split(":");
  if (scheme !== "scrypt" || !hashHex) return false;
  const expectedBuf = Buffer.from(hashHex, "hex");
  // Sel fixe dérivé du secret de session : le hachage reste vérifiable sans stocker le sel à part.
  const salt = Buffer.from(sessionSecret().slice(0, 32));
  const enteredBuf = scryptSync(entered, salt, expectedBuf.length);
  return enteredBuf.length === expectedBuf.length && timingSafeEqual(enteredBuf, expectedBuf);
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

/** Crée le jeton de session : base64url(exp).signature. */
export function createSessionToken(): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Vérifie signature + expiration. */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  // digest() donne les octets bruts ; Buffer.from(str) décoderait la chaîne base64url en UTF-8
  // (longueurs différentes → timingSafeEqual lèverait une exception).
  const expected = createHmac("sha256", sessionSecret()).update(payload).digest();
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number };
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}

/** Lit le cookie de session et vérifie sa validité (côté serveur uniquement). */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Options du cookie : httpOnly, sameSite lax, secure en production. */
export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_MS / 1000,
};
