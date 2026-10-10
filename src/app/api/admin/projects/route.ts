import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { listProjects, createProject } from "@/lib/admin/projects";
import { projectSchema, normalizeProject } from "@/lib/admin/project-validate";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  const projects = await listProjects();
  return NextResponse.json({ ok: true, projects });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const body = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_project" }, { status: 400 });
  }

  const data = normalizeProject(parsed.data);
  const existing = await listProjects();
  if (existing.some((p) => p.id === data.id)) {
    return NextResponse.json({ ok: false, error: "duplicate_id" }, { status: 409 });
  }

  const nextOrder = existing.length === 0 ? 0 : Math.max(...existing.map((p) => p.sortOrder)) + 1;
  await createProject(data, nextOrder);
  return NextResponse.json({ ok: true }, { status: 201 });
}
