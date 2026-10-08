"use server";

import { z } from "zod";
import { sendContactEmail } from "@/lib/send-contact-email";

const schema = z.object({
  nom: z.string().trim().min(2, "Indiquez votre nom."),
  email: z.string().trim().email("Email invalide."),
  tel: z.string().trim().min(6, "Téléphone invalide."),
  projet: z.string().trim().min(2, "Précisez le type de projet."),
  budget: z.string().trim().min(1, "Indiquez un budget."),
  delai: z.string().trim().min(1, "Indiquez un délai."),
  message: z.string().trim().min(10, "10 caractères minimum."),
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
    (["nom", "email", "tel", "projet", "budget", "delai", "message"] as const).map((k) => [k, String(formData.get(k) ?? "")])
  );
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const errors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactField;
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors, values: raw, message: "Vérifiez les champs en orange." };
  }

  try {
    await sendContactEmail(parsed.data);
    return { ok: true };
  } catch {
    return { ok: false, values: raw, message: "L'envoi a échoué. Réessayez dans un instant." };
  }
}
