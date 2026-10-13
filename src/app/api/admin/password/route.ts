import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/guard";
import { verifyCurrentPassword, hashPassword } from "@/lib/admin/auth";
import { setSetting } from "@/lib/db";

export const runtime = "nodejs";

/* Limitation de débit simple, en mémoire (comme la connexion). */
const hits = new Map<string, number[]>();
function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) return false;
  recent.push(now);
  hits.set(key, recent);
  return true;
}

const schema = z.object({
  current: z.string().min(1, "Mot de passe actuel requis."),
  next: z.string().min(8, "Le nouveau mot de passe doit faire8 caractères minimum.").max(200),
});

/**
 * POST /api/admin/password — change le mot de passe admin (session requise).
 *
 * Le nouveau hachage est stocké en base (clé `admin_password_hash`) et prime
 * sur ADMIN_PASSWORD_HASH à la connexion suivante. Les sessions existantes
 * restent valables jusqu'à leur expiration (7 jours).
 */
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`password:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const { current, next } = parsed.data;

  if (!(await verifyCurrentPassword(current))) {
    return NextResponse.json({ ok: false, error: "invalid_current" }, { status: 401 });
  }

  if (current === next) {
    return NextResponse.json({ ok: false, error: "same_password" }, { status: 400 });
  }

  await setSetting("admin_password_hash", hashPassword(next));
  return NextResponse.json({ ok: true });
}
