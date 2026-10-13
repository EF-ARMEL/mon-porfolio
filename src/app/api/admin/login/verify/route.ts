import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/admin/auth";
import { verifyChallenge } from "@/lib/admin/twofa";

export const runtime = "nodejs";

/* Limitation de débit dédiée aux tentatives de code. */
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
 * Étape 2 de la connexion : vérification du code à6 chiffres reçu par e-mail.
 * Succès → création du cookie de session (comme l'ancienne connexion directe).
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`login-verify:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as { challengeId?: string; code?: string } | null;
  const challengeId = typeof body?.challengeId === "string" ? body.challengeId : "";
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (!challengeId || !code) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  const result = await verifyChallenge(challengeId, code);
  if (result !== "ok") {
    const error =
      result === "expired"
        ? "code_expired"
        : result === "locked"
        ? "code_locked"
        : "invalid_code";
    const status = result === "locked" ? 429 : 401;
    return NextResponse.json({ ok: false, error }, { status });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);
  return res;
}
