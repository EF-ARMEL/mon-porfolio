import { NextResponse } from "next/server";
import { clientIp, normalize, rateLimit, signToken } from "@/lib/quiz/security";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(`idol:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let answer = "";
  try {
    const body = await req.json();
    if (typeof body?.answer === "string") answer = body.answer.slice(0, 80);
  } catch {
    /* corps invalide : traité comme une mauvaise réponse */
  }

  const accepted = (process.env.QUIZ_IDOL_ANSWERS ?? "").split(",").map(normalize).filter(Boolean);
  if (accepted.length === 0) console.warn("[quiz] QUIZ_IDOL_ANSWERS est vide : aucune réponse ne sera acceptée.");

  const given = normalize(answer);
  // Pratique pour tester en local : « demo » n'est accepté QU'EN développement.
  const ok = given.length > 0 && (accepted.includes(given) || (process.env.NODE_ENV === "development" && given === "demo"));

  if (!ok) return NextResponse.json({ ok: false });
  return NextResponse.json({ ok: true, token: signToken() });
}
