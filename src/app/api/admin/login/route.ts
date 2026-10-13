import { NextResponse } from "next/server";
import { verifyCurrentPassword, createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/admin/auth";
import { createChallenge, twoFactorEmail, maskEmail, sendLoginCodeMail } from "@/lib/admin/twofa";

export const runtime = "nodejs";

/* Limitation de débit simple, en mémoire (comme le quiz). */
const hits = new Map<string, number[]>();
function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) return false;
  recent.push(now);
  hits.set(key, recent);
  return true;
}

/**
 * Étape 1 de la connexion :
 * -2FA désactivée (aucune adresse e-mail résolue) → session immédiate (ancien comportement).
 * -2FA activée → envoie un code à6 chiffres par e-mail et retourne
 *   { twoFactor: true, challengeId } SANS cookie ; la session est créée par
 *   POST /api/admin/login/verify.
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`login:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password;
  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  if (!(await verifyCurrentPassword(password))) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const email = twoFactorEmail();
  if (!email) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);
    return res;
  }

  try {
    const challenge = await createChallenge();
    await sendLoginCodeMail(email, challenge.code);
    return NextResponse.json({
      ok: true,
      twoFactor: true,
      challengeId: challenge.id,
      email: maskEmail(email),
    });
  } catch (err) {
    console.error("[2FA] Échec d'envoi du code :", err);
    return NextResponse.json({ ok: false, error: "email_failed" }, { status: 500 });
  }
}
