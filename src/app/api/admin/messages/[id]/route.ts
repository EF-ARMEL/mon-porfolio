import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/guard";
import { setMessageRead, deleteMessage } from "@/lib/admin/messages";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({ isRead: z.boolean() });

/** PATCH : marque lu / non lu. */
export async function PATCH(req: Request, { params }: Ctx) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  await setMessageRead(numId, parsed.data.isRead);
  return NextResponse.json({ ok: true });
}

/** DELETE : supprime un message. */
export async function DELETE(_req: Request, { params }: Ctx) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  await deleteMessage(numId);
  return NextResponse.json({ ok: true });
}
