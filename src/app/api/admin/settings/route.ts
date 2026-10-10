import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/guard";
import { getSetting, setSetting, initDb } from "@/lib/db";

export const runtime = "nodejs";

const KEY = "maintenance";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  await initDb();
  const v = await getSetting(KEY);
  return NextResponse.json({ ok: true, maintenance: v === "1" });
}

const patchSchema = z.object({ maintenance: z.boolean() });

/** PATCH : active ou désactive le mode maintenance. */
export async function PATCH(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  await setSetting(KEY, parsed.data.maintenance ? "1" : "0");
  return NextResponse.json({ ok: true, maintenance: parsed.data.maintenance });
}
