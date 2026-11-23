import { db, initDb } from "@/lib/db";

/** Chemin public des images envoyées depuis l'admin (servies par src/app/uploads/[name]/route.ts). */
export const UPLOAD_PREFIX = "/uploads/";

/** Nom de fichier tel que généré par /api/admin/upload : p-<base36>-<hex>.<ext>. */
export const UPLOAD_NAME = /^p-[a-z0-9]+-[a-f0-9]{8}\.(jpg|png|webp|avif)$/;

export async function saveUpload(name: string, mime: string, data: Uint8Array): Promise<void> {
  await initDb();
  await db().execute({
    sql: "INSERT INTO uploads (name, mime, data) VALUES (?, ?, ?)",
    args: [name, mime, data],
  });
}

export async function getUpload(name: string): Promise<{ mime: string; data: ArrayBuffer } | null> {
  if (!UPLOAD_NAME.test(name)) return null;
  await initDb();
  const rs = await db().execute({ sql: "SELECT mime, data FROM uploads WHERE name = ?", args: [name] });
  const row = rs.rows[0];
  if (!row || typeof row.mime !== "string" || !(row.data instanceof ArrayBuffer)) return null;
  return { mime: row.mime, data: row.data };
}
