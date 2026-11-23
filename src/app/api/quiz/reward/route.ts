import { NextResponse } from "next/server";
import { claimToken, clientIp, isEmail, rateLimit, releaseToken, verifyToken } from "@/lib/quiz/security";
import { sendRewardMail } from "@/lib/quiz/mailer";
import { logQuizResult } from "@/lib/admin/quiz";

export const runtime = "nodejs";

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  if (!(await rateLimit(`reward:${clientIp(req)}`, 5, 60 * 60 * 1000))) return fail("rate_limited", 429);

  const body = await req.json().catch(() => null);
  if (!body || typeof body.email !== "string" || typeof body.token !== "string") return fail("invalid_request", 400);

  // Honeypot : un robot remplit ce champ caché. On répond « ok » sans rien envoyer.
  if (typeof body.website === "string" && body.website.length > 0) return NextResponse.json({ ok: true });

  const email = body.email.trim().toLowerCase();
  if (!isEmail(email)) return fail("invalid_email", 400);

  const token = verifyToken(body.token);
  if (!token) return fail("invalid_token", 401);
  // Réservation atomique AVANT l'envoi : deux requêtes simultanées avec le même
  // jeton ne peuvent pas déclencher deux e-mails.
  if (!(await claimToken(token.n))) return fail("already_used", 409);

  try {
    await sendRewardMail(email);
  } catch (err) {
    console.error("[quiz] Échec d'envoi :", err);
    await releaseToken(token.n); // un échec d'envoi permet de réessayer avec le même jeton
    return fail("mail_failed", 502);
  }

  // Tracé pour le dashboard admin (qui a réussi la question secrète).
  try {
    await logQuizResult({ email, answer: "question secrète réussie", score: 5 });
  } catch (err) {
    console.error("[quiz] Échec de tracé en base :", err);
  }
  return NextResponse.json({ ok: true });
}
