import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/guard";
import { getProject, updateProject, deleteProject, listProjects } from "@/lib/admin/projects";
import { projectSchema, normalizeProject } from "@/lib/admin/project-validate";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/** PUT : met à jour un projet (contenu + éventuellement l'ordre). */
export async function PUT(req: Request, { params }: Ctx) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { id } = await params;
  const current = await getProject(id);
  if (!current) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_project" }, { status: 400 });
  }

  const data = normalizeProject(parsed.data);
  // L'id du corps doit correspondre à l'id de l'URL (pas de renommage implicite).
  if (data.id !== id) {
    return NextResponse.json({ ok: false, error: "id_mismatch" }, { status: 400 });
  }

  const order = z.number().int().nonnegative().safeParse((body as { sortOrder?: number }).sortOrder);
  await updateProject(id, data, order.success ? order.data : current.sortOrder);
  return NextResponse.json({ ok: true });
}

/** DELETE : supprime un projet. */
export async function DELETE(_req: Request, { params }: Ctx) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { id } = await params;
  const current = await getProject(id);
  if (!current) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  await deleteProject(id);
  return NextResponse.json({ ok: true });
}

/** PATCH : réordonne les projets. Body : { order: string[] } (ids dans le nouvel ordre). */
export async function PATCH(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const body = (await req.json().catch(() => null)) as { order?: string[] } | null;
  if (!body || !Array.isArray(body.order) || !body.order.every((x) => typeof x === "string")) {
    return NextResponse.json({ ok: false, error: "invalid_order" }, { status: 400 });
  }

  const all = await listProjects();
  const known = new Set(all.map((p) => p.id));
  // L'ordre doit contenir exactement tous les ids existants.
  if (body.order.length !== all.length || !body.order.every((x) => known.has(x))) {
    return NextResponse.json({ ok: false, error: "order_mismatch" }, { status: 400 });
  }

  for (let i = 0; i < body.order.length; i++) {
    const p = all.find((x) => x.id === body.order![i]);
    if (p) await updateProject(p.id, p, i);
  }
  return NextResponse.json({ ok: true });
}
