import { z } from "zod";

/**
 * Valeur d'image acceptée :
 * - /projects/… : fichier committé dans public/, servi statiquement ;
 * - /uploads/…  : image envoyée depuis l'admin, stockée en base ;
 * - https://…   : URL absolue (affichée sans optimisation next/image).
 * Tout le reste est refusé : http://, un autre dossier, un chemin relatif.
 */
export function isValidImageValue(value: string): boolean {
  const v = value.trim();
  if (v === "") return true;
  if (v.startsWith("/projects/")) return v.length > "/projects/".length;
  if (v.startsWith("/uploads/")) return v.length > "/uploads/".length;
  if (v.startsWith("https://")) {
    try {
      return new URL(v).hostname.length > 0;
    } catch {
      return false;
    }
  }
  return false;
}

/** Schéma de validation d'un projet reçu de l'admin (aligné sur DetailProject). */
export const projectSchema = z.object({
  id: z.string().trim().min(1).max(10),
  title: z.string().trim().min(1).max(120),
  year: z.string().trim().min(1).max(10),
  kicker: z.string().trim().max(160).default(""),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  href: z.string().trim().url().max(300).optional(),
  image: z
    .string()
    .trim()
    .max(300)
    .refine((v) => isValidImageValue(v), {
      message: "Chemin d'image invalide : attendu /projects/…, /uploads/… ou une URL https://",
    })
    .optional(),
  desc: z.string().trim().max(500).optional(),
  status: z.string().trim().max(60).optional(),
  from: z.string().trim().max(20).default("#7c3aed"),
  to: z.string().trim().max(20).default("#FF6A00"),
  detail: z.object({
    objective: z.string().trim().max(800).default(""),
    blocks: z
      .array(
        z.object({
          title: z.string().trim().max(120).default(""),
          desc: z.string().trim().max(400).default(""),
        })
      )
      .max(8)
      .default([]),
    facts: z.array(z.string().trim().max(120)).max(10).default([]),
  }),
});

export type ProjectInput = z.infer<typeof projectSchema>;

/** href/image/status : chaîne vide → undefined (pour distinguer « absent » de « vide »). */
export function normalizeProject(input: ProjectInput) {
  return {
    ...input,
    href: input.href || undefined,
    image: input.image || undefined,
    desc: input.desc || undefined,
    status: input.status || undefined,
  };
}
