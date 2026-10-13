import nodemailer, { type Transporter } from "nodemailer";

/**
 * Transporteur e-mail partagé (quiz, 2FA admin, …).
 *
 * - SMTP_HOST défini → vrai transport SMTP (voir .env.example).
 * - Sinon, en développement : boîte de test Ethereal (aucun e-mail réel,
 *   l'URL d'aperçu est loguée). En production : erreur explicite.
 */
let cached: Promise<Transporter> | null = null;

/**
 * Expéditeur sûr pour tous les envois (2FA, quiz, contact).
 *
 * MAIL_FROM n'est utilisé que s'il est syntaxiquement valide. Une valeur
 * cassée (typiquement une ligne .env où deux clés se sont fusionnées) ferait
 * échouer tout l'envoi avec « Bad sender address syntax » : on récupère alors
 * l'adresse réelle entre chevrons, et à défaut on retombe sur une adresse valide.
 */
export function mailFrom(): string {
  const raw = (process.env.MAIL_FROM ?? "").trim();
  const bare = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
  if (bare.test(raw)) return raw;
  // Forme « Nom <adresse> » sans texte parasite après le « > ».
  if (/^(?:"?[^"<>]*"?\s*)?<[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>$/.test(raw)) return raw;
  // Forme corrompue contenant une adresse valide : on la conserve proprement.
  const addr = raw.match(/<([^\s@<>]+@[^\s@<>]+\.[^\s@<>]+)>/)?.[1];
  if (addr) return `Nousdev <${addr}>`;
  return "Nousdev <no-reply@nousdev.com>";
}

export function getTransporter(): Promise<Transporter> {
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
    console.warn("[mail] SMTP non configuré : boîte de test Ethereal utilisée (aucun vrai e-mail n'est envoyé).");
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
