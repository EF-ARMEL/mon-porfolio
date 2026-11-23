import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { requireAdmin } from "@/lib/admin/guard";
import { saveUpload, UPLOAD_PREFIX } from "@/lib/admin/uploads";

export const runtime = "nodejs";

/** Formats acceptés → extension canonique. */
const TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};
const MAX_SIZE = 4 * 1024 * 1024; // 4 Mo (sous la limite de corps de requête Vercel de 4,5 Mo)

/**
 * Upload d'une image de projet (admin uniquement).
 * Reçoit un FormData avec un champ `file`, valide le format et la taille,
 * stocke l'image en base (le disque Vercel est en lecture seule) et renvoie
 * le chemin public servi par /uploads/[name].
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
  try {
    await saveUpload(name, file.type, new Uint8Array(await file.arrayBuffer()));
  } catch (err) {
    console.error("[upload] Enregistrement impossible :", err);
    return NextResponse.json({ ok: false, error: "write_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, path: `${UPLOAD_PREFIX}${name}` });
}
