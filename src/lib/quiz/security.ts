import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { db, initDb } from "@/lib/db";

/** Même normalisation que pour les variantes acceptées : minuscules, sans accents, sans ponctuation. */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

export const isEmail = (s: string) => s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

export const clientIp = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";

const secret = () => {
  const s = process.env.QUIZ_SECRET;
  if (!s || s.length < 32) throw new Error("QUIZ_SECRET manquant ou trop court (32 caractères minimum).");
  return s;
};

/** Jeton signé : base64url(payload).base64url(hmac) — valable 30 min. */
export function signToken(ttlMs = 30 * 60 * 1000) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + ttlMs, n: randomBytes(8).toString("hex") })).toString(
    "base64url"
  );
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyToken(token: string): { n: string } | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest();
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const { exp, n } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof exp !== "number" || typeof n !== "string" || Date.now() > exp) return null;
    return { n };
  } catch {
    return null;
  }
}

/*
 * Usage unique et limitation de débit : stockés en base, pas en mémoire.
 * En serverless, chaque instance a sa propre mémoire : un Set/Map local
 * laisserait rejouer un jeton ou contourner la limite en tombant sur une
 * autre instance.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Réserve un jeton de façon atomique. Retourne false s'il était déjà consommé.
 * (INSERT OR IGNORE : deux requêtes simultanées ne peuvent pas réussir toutes les deux.)
 */
export async function claimToken(n: string): Promise<boolean> {
  await initDb();
  const now = Date.now();
  // Les jetons expirent en 30 min : inutile de garder la trace au-delà d'un jour.
  await db().execute({ sql: "DELETE FROM used_tokens WHERE used_at < ?", args: [now - DAY_MS] });
  const rs = await db().execute({
    sql: "INSERT OR IGNORE INTO used_tokens (nonce, used_at) VALUES (?, ?)",
    args: [n, now],
  });
  return rs.rowsAffected === 1;
}

/** Libère un jeton réservé (ex. envoi d'e-mail échoué : l'utilisateur peut réessayer). */
export async function releaseToken(n: string): Promise<void> {
  await initDb();
  await db().execute({ sql: "DELETE FROM used_tokens WHERE nonce = ?", args: [n] });
}

/** Limitation de débit à fenêtre glissante. Retourne false si la limite est atteinte. */
export async function rateLimit(key: string, max: number, windowMs: number): Promise<boolean> {
  await initDb();
  const now = Date.now();
  const client = db();
  await client.batch(
    [
      { sql: "DELETE FROM rate_hits WHERE ts < ?", args: [now - DAY_MS] },
      { sql: "DELETE FROM rate_hits WHERE key = ? AND ts <= ?", args: [key, now - windowMs] },
    ],
    "write"
  );
  const rs = await client.execute({ sql: "SELECT COUNT(*) AS c FROM rate_hits WHERE key = ?", args: [key] });
  if (Number(rs.rows[0]?.c ?? 0) >= max) return false;
  await client.execute({ sql: "INSERT INTO rate_hits (key, ts) VALUES (?, ?)", args: [key, now] });
  return true;
}
