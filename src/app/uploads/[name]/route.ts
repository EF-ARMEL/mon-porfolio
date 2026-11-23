import { getUpload } from "@/lib/admin/uploads";

export const runtime = "nodejs";

/**
 * GET /uploads/[name] — sert une image de projet stockée en base.
 * Le nom est unique et jamais réécrit : l'image peut être mise en cache indéfiniment.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const file = await getUpload(name);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(file.data, {
    headers: {
      "Content-Type": file.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
