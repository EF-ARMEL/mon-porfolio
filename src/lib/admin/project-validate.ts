import { z } from "zod";

/** Schéma de validation d'un projet reçu de l'admin (aligné sur DetailProject). */
export const projectSchema = z.object({
  id: z.string().trim().min(1).max(10),
  title: z.string().trim().min(1).max(120),
  year: z.string().trim().min(1).max(10),
  kicker: z.string().trim().max(160).default(""),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  href: z.string().trim().url().max(300).optional(),
  image: z.string().trim().max(300).optional(),
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
