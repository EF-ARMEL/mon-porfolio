import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { listMessages, countUnread } from "@/lib/admin/messages";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  const [messages, unread] = await Promise.all([listMessages(), countUnread()]);
  return NextResponse.json({ ok: true, messages, unread });
}
