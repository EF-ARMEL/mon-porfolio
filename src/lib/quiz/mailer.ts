import nodemailer, { type Transporter } from "nodemailer";
import { readFile } from "node:fs/promises";
import path from "node:path";

const PDF_PATH = path.join(process.cwd(), "private", "guide-vibe-coding-2026.pdf");

let cached: Promise<Transporter> | null = null;

function getTransporter(): Promise<Transporter> {
  if (cached) return cached;
  cached = (async () => {
    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
    if (SMTP_HOST) {
      const port = Number(SMTP_PORT ?? 465);
      return nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure: SMTP_SECURE ? SMTP_SECURE === "true" : port === 465,
        auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
      });
    }
    if (process.env.NODE_ENV === "production") throw new Error("SMTP_HOST manquant en production.");
    const acc = await nodemailer.createTestAccount();
    console.warn("[quiz] SMTP non configuré : boîte de test Ethereal utilisée (aucun vrai e-mail n'est envoyé).");
    return nodemailer.createTransport({
      host: acc.smtp.host,
      port: acc.smtp.port,
      secure: acc.smtp.secure,
      auth: { user: acc.user, pass: acc.pass },
    });
  })();
  cached.catch(() => {
    cached = null;
  });
  return cached;
}

const SUBJECT = "Ta récompense : Bonnes pratiques du vibe coding en 2026";

const TEXT = `Bien joué, tu connais Nousdev !

Voici ta récompense : le guide « Bonnes pratiques du vibe coding en 2026 », en pièce jointe (PDF).
Si tu ne le vois pas, regarde dans tes spams.

Bonne lecture,
Nousdev`;

const HTML = `<!doctype html><html lang="fr"><body style="margin:0;background:#050505;font-family:Arial,Helvetica,sans-serif;color:#ffffff">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#0b0b0b;border:1px solid #2a2a2a;border-radius:20px">
<tr><td style="padding:36px 36px 8px;font-size:12px;font-weight:700;letter-spacing:.08em;color:#FF6A00;text-transform:uppercase">Question secrète · réussie</td></tr>
<tr><td style="padding:0 36px;font-size:30px;line-height:1.1;font-weight:900;color:#FFD000">Bien joué, tu connais Nousdev.</td></tr>
<tr><td style="padding:16px 36px 8px;font-size:16px;line-height:1.6;color:#e4e4e7">Voici ta récompense : le guide <strong style="color:#ffffff">« Bonnes pratiques du vibe coding en 2026 »</strong>, en pièce jointe de cet e-mail (PDF).</td></tr>
<tr><td style="padding:8px 36px 36px;font-size:14px;line-height:1.6;color:#a1a1aa">Si tu ne le vois pas, regarde dans tes spams.<br>Bonne lecture,<br><strong style="color:#ffffff">Nousdev</strong></td></tr>
</table></td></tr></table></body></html>`;

export async function sendRewardMail(to: string) {
  const pdf = await readFile(PDF_PATH);
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM ?? "Nousdev <no-reply@localhost>",
    to,
    subject: SUBJECT,
    text: TEXT,
    html: HTML,
    attachments: [{ filename: "Guide-Vibe-Coding-2026.pdf", content: pdf, contentType: "application/pdf" }],
  });
  if (process.env.NODE_ENV !== "production") {
    const url = nodemailer.getTestMessageUrl(info);
    if (url) console.info("[quiz] Aperçu de l'e-mail :", url);
  }
}
