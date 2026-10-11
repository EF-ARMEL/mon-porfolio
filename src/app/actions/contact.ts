"use server";

import { z } from "zod";
import { sendContactEmail } from "@/lib/send-contact-email";
import { saveMessage } from "@/lib/admin/messages";

const schema = z.object({
  nom: z.string().trim().min(2, "Indiquez votre nom."),
  email: z.string().trim().email("Email invalide."),
  // Champs secondaires : facultatifs (acceptés vides) pour que le formulaire
  // reste ouvert à une simple question, une idée, sans obligation de "projet".
  tel: z
    .string()
    .trim()
    .refine((v) => v === "" || v.length >= 6, "Téléphone invalide.")
    .optional()
    .default(""),
  projet: z.string().trim().min(2, "Dites-nous en un mot de quoi il s'agit."),
  budget: z.string().trim().optional().default(""),
  delai: z.string().trim().optional().default(""),
  message: z.string().trim().min(10, "Raconte-nous un peu plus (10 caractères minimum)."),
});

export type ContactField = keyof z.infer<typeof schema>;

export type ContactState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  values?: Partial<Record<ContactField, string>>;
};

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot : un robot remplit ce champ caché, on fait semblant que tout va bien.
  if (String(formData.get("website") ?? "") !== "") return { ok: true };

  const raw = Object.fromEntries(
    (["nom", "email", "tel", "projet", "budget", "delai", "message"] as const).map((k) => [
      k,
      String(formData.get(k) ?? ""),
    ])
  );
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const errors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactField;
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors, values: raw, message: "Il manque juste quelques infos — regarde les champs signalés." };
  }

  const data = parsed.data;

  // 1. Enregistrement en base (visible dans le dashboard admin).
  let stored = false;
  try {
    await saveMessage(data);
    stored = true;
  } catch (err) {
    console.error("[contact] Échec d'enregistrement en base :", err);
  }

  // 2. Notification e-mail (échec non bloquant : le message est déjà en base).
  try {
    await sendContactEmail(data);
  } catch (err) {
    console.error("[contact] Échec d'envoi d'e-mail :", err);
    if (!stored) {
      return { ok: false, values: raw, message: "L'envoi a échoué. Réessayez dans un instant." };
    }
  }

  return { ok: true };
}
