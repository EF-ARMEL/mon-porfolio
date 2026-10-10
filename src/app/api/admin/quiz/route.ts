import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { listQuizResults } from "@/lib/admin/quiz";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  const results = await listQuizResults();
  return NextResponse.json({ ok: true, results });
}
