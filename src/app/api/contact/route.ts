import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { clientIp, isEmail, rateLimit } from "@/lib/quiz/security";
import { getTransporter, mailFrom } from "@/lib/smtp";
import { saveMessage } from "@/lib/admin/messages";

export const runtime = "nodejs";

/**
 * Endpoint du formulaire « Le Terminal » (composant ContactTerminal).
 *
 * Contrairement à la server action `sendContact` (ancien formulaire, FormData),
 * ce formulaire POSTe du JSON depuis un composant client autonome.
 *
 * Sécurité :
 * - honeypot `website` : rempli → {ok:true} sans rien enregistrer ni envoyer ;
 * - validation stricte côté serveur (le client ne fait que guider) ;
 * - limitation de débit 5 envois / heure / IP (en mémoire) ;
 * - le destinataire ne vient QUE de l'environnement, jamais du corps de requête.
 */

const LIMIT = { max: 5, windowMs: 60 * 60 * 1000 }; // 5 envois / heure / IP

type Body = Record<string, unknown>;

/** 4 caractères hexadécimaux en majuscules : NSD-7F3A. */
const ticket = () => `NSD-${randomBytes(2).toString("hex").toUpperCase()}`;

/** Lecture d'un champ texte : trim, sans troncature (la validation porte sur
 *  la valeur réelle). Plafond généreux pour éviter un abus de mémoire. */
const raw = (body: Body, key: string) => {
  const v = body[key];
  return typeof v === "string" ? v.trim().slice(0, 8000) : "";
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot : on répond comme un succès pour ne pas signaler le piège au robot.
  if (raw(body, "website") !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = raw(body, "name");
  const email = raw(body, "email");
  const tel = raw(body, "tel");
  const projet = raw(body, "projet");
  const budget = raw(body, "budget");
  const delai = raw(body, "delai");
  const message = raw(body, "message");

  // Champs obligatoires (longueur MAX incluse : on refuse, on ne tronque pas).
  if (name.length < 1 || name.length > 80) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (message.length < 10 || message.length > 2000) {
    return NextResponse.json({ ok: false, error: "invalid_message" }, { status: 400 });
  }
  // Champs facultatifs : valides vides, mais contrôlés s'ils sont renseignés.
  if (tel !== "" && (tel.length < 6 || tel.length > 30)) {
    return NextResponse.json({ ok: false, error: "invalid_tel" }, { status: 400 });
  }
  if (projet.length < 2 || projet.length > 120) {
    return NextResponse.json({ ok: false, error: "invalid_projet" }, { status: 400 });
  }
  if (budget.length > 60 || delai.length > 60) {
    return NextResponse.json({ ok: false, error: "invalid_option" }, { status: 400 });
  }

  if (!rateLimit(`contact:${clientIp(req)}`, LIMIT.max, LIMIT.windowMs)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  // Destinataire : CONTACT_TO_EMAIL d'abord, puis MAIL_TO / SMTP_USER (réglages
  // déjà en place pour le quiz et la 2FA). Jamais dérivé de la requête.
  const to = process.env.CONTACT_TO_EMAIL || process.env.MAIL_TO || process.env.SMTP_USER;
  const host = process.env.SMTP_HOST;

  if (!to || (!host && process.env.NODE_ENV === "production")) {
    console.error("[contact] Configuration e-mail manquante (CONTACT_TO_EMAIL / SMTP_HOST).");
    return NextResponse.json({ ok: false, error: "mail_not_configured" }, { status: 500 });
  }

  // Enregistrement en base : le message reste visible dans le dashboard admin
  // même si l'e-mail de notification échoue plus bas.
  try {
    await saveMessage({ nom: name, email, tel, projet, budget, delai, message });
  } catch (err) {
    console.error("[contact] Échec d'enregistrement en base :", err);
  }

  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const line = (label: string, value: string) =>
    value ? `<p style="margin:0 0 4px"><strong style="color:#fff">${label} :</strong> ${esc(value)}</p>` : "";

  try {
    const transporter = await getTransporter();
    await transporter.sendMail({
      from: mailFrom(),
      to,
      replyTo: email,
      subject: `Message du site — ${name}${projet ? ` · ${projet}` : ""}`,
      text: `Message reçu via le formulaire « Le Terminal ».\n\nNom : ${name}\nE-mail : ${email}\nTéléphone : ${tel || "—"}\nSujet : ${projet || "—"}\nBudget : ${budget || "—"}\nDélai : ${delai || "—"}\n\n${message}`,
      html: `<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#e4e4e7;background:#0a0a0a;padding:24px">
  <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#FF6A00;margin:0 0 12px">Formulaire Le Terminal</p>
  ${line("Nom", name)}
  <p style="margin:0 0 4px"><strong style="color:#fff">E-mail :</strong> <a href="mailto:${esc(email)}" style="color:#FFD000">${esc(email)}</a></p>
  ${line("Téléphone", tel)}
  ${line("Sujet", projet)}
  ${line("Budget", budget)}
  ${line("Délai", delai)}
  <div style="border-left:3px solid #FF6A00;padding:12px 16px;background:rgba(255,255,255,0.03);margin-top:16px">${esc(message).replace(/\n/g, "<br />")}</div>
</div>`,
    });
  } catch (err) {
    console.error("[contact] Échec d'envoi d'e-mail :", err);
    return NextResponse.json({ ok: false, error: "mail_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, ticket: ticket() });
}
