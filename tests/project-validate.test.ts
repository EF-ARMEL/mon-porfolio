/**
 * Tests de src/lib/admin/project-validate.ts — schéma zod des projets.
 */
import { describe, expect, it } from "vitest";
import { normalizeProject, projectSchema } from "@/lib/admin/project-validate";

const valid = {
  id: "04",
  title: "Projet test",
  year: "2026",
  detail: {},
};

describe("projectSchema", () => {
  it("accepte un projet minimal et applique les défauts", () => {
    const parsed = projectSchema.parse(valid);
    expect(parsed.kicker).toBe("");
    expect(parsed.tags).toEqual([]);
    expect(parsed.from).toBe("#7c3aed");
    expect(parsed.to).toBe("#FF6A00");
    expect(parsed.detail.blocks).toEqual([]);
    expect(parsed.detail.facts).toEqual([]);
  });

  it("rejette un id vide ou trop long", () => {
    expect(projectSchema.safeParse({ ...valid, id: "" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...valid, id: "12345678901" }).success).toBe(false);
  });

  it("rejette un titre vide", () => {
    expect(projectSchema.safeParse({ ...valid, title: "  " }).success).toBe(false);
  });

  it("rejette un href invalide et accepte une URL valide", () => {
    expect(projectSchema.safeParse({ ...valid, href: "pas-une-url" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...valid, href: "https://exemple.com" }).success).toBe(true);
  });

  it("rejette plus de 12 tags", () => {
    const tags = Array.from({ length: 13 }, (_, i) => `t${i}`);
    expect(projectSchema.safeParse({ ...valid, tags }).success).toBe(false);
  });

  it("rejette plus de 8 blocs éditoriaux", () => {
    const blocks = Array.from({ length: 9 }, () => ({ title: "T", desc: "D" }));
    expect(projectSchema.safeParse({ ...valid, detail: { blocks } }).success).toBe(false);
  });

  it("rejette un objet vide", () => {
    expect(projectSchema.safeParse({}).success).toBe(false);
  });
});

describe("normalizeProject", () => {
  it("chaînes vides → undefined pour image/desc/status (champs libres)", () => {
    const parsed = projectSchema.parse({ ...valid, image: "", desc: "", status: "" });
    const out = normalizeProject(parsed);
    expect(out.image).toBeUndefined();
    expect(out.desc).toBeUndefined();
    expect(out.status).toBeUndefined();
  });

  it("href vide → undefined (branche défensive ; le formulaire envoie déjà undefined)", () => {
    // Le schéma rejette href:"" (.url()), donc on teste la branche directement.
    const parsed = projectSchema.parse(valid);
    const out = normalizeProject({ ...parsed, href: "" });
    expect(out.href).toBeUndefined();
  });

  it("valeurs préserves quand renseignées", () => {
    const parsed = projectSchema.parse({ ...valid, href: "https://a.co", status: "En ligne" });
    const out = normalizeProject(parsed);
    expect(out.href).toBe("https://a.co");
    expect(out.status).toBe("En ligne");
  });
});
