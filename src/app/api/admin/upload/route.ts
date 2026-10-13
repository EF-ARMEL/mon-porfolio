import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { requireAdmin } from "@/lib/admin/guard";

export const runtime = "nodejs";

/** Formats acceptés → extension canonique. */
const TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

/**
 * Upload d'une image de projet (admin uniquement).
 * Reçoit un FormData avec un champ `file`, valide le format et la taille,
 * écrit le fichier dans public/projects/ et renvoie le chemin public
 * attendu par le champ `image` du projet (/projects/xxx.png).
 */
export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "invalid_file" }, { status: 400 });
  }

  const ext = TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ ok: false, error: "unsupported_type" }, { status: 415 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  const name = `p-${Date.now().toString(36)}-${randomBytes(4).toString("hex")}${ext}`;
  const dir = path.join(process.cwd(), "public", "projects");
  try {
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  } catch (err) {
    console.error("[upload] Écriture impossible :", err);
    return NextResponse.json({ ok: false, error: "write_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, path: `/projects/${name}` });
}
