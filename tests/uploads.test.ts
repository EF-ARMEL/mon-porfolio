/**
 * Tests du stockage d'images en base (src/lib/admin/uploads.ts) et de la route /uploads/[name].
 */
import { describe, expect, it } from "vitest";
import { getUpload, saveUpload } from "@/lib/admin/uploads";
import { GET } from "@/app/uploads/[name]/route";
import { isValidImageValue } from "@/lib/admin/project-validate";

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);
const ctx = (name: string) => ({ params: Promise.resolve({ name }) });

describe("uploads", () => {
  it("enregistre puis relit une image à l'identique", async () => {
    await saveUpload("p-abc123-0a1b2c3d.png", "image/png", PNG);
    const file = await getUpload("p-abc123-0a1b2c3d.png");
    expect(file?.mime).toBe("image/png");
    expect(new Uint8Array(file!.data)).toEqual(PNG);
  });

  it("refuse un nom qui ne suit pas le format généré", async () => {
    expect(await getUpload("../secret.png")).toBeNull();
    expect(await getUpload("p-abc123-0a1b2c3d.svg")).toBeNull();
  });

  it("la route sert l'image avec le bon type et un cache long", async () => {
    await saveUpload("p-route1-11112222.webp", "image/webp", PNG);
    const res = await GET(new Request("http://x"), ctx("p-route1-11112222.webp"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/webp");
    expect(res.headers.get("cache-control")).toContain("immutable");
    expect(new Uint8Array(await res.arrayBuffer())).toEqual(PNG);
  });

  it("la route répond 404 pour une image absente", async () => {
    const res = await GET(new Request("http://x"), ctx("p-absent-99998888.png"));
    expect(res.status).toBe(404);
  });

  it("le chemin /uploads/… est accepté comme image de projet", () => {
    expect(isValidImageValue("/uploads/p-abc123-0a1b2c3d.png")).toBe(true);
    expect(isValidImageValue("/uploads/")).toBe(false);
  });
});
