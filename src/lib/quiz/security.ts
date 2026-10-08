import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

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

/* Usage unique du jeton (en mémoire : suffisant pour un portfolio ; voir limites dans le rapport). */
const used = new Set<string>();
export const isUsed = (n: string) => used.has(n);
export const markUsed = (n: string) => {
  if (used.size > 5000) used.clear();
  used.add(n);
};

/* Limitation de débit simple, en mémoire. */
const hits = new Map<string, number[]>();
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  if (hits.size > 5000) hits.clear();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
