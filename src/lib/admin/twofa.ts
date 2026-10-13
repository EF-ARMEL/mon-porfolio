import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";
import { initDb, db } from "@/lib/db";
import { getTransporter, mailFrom } from "@/lib/smtp";

/**
 * Double authentification par e-mail (code à usage unique).
 *
 * Étapes : après validation du mot de passe, un code à6 chiffres est généré,
 * stocké HACHÉ (jamais en clair) avec un délai de10 minutes et5 tentatives
 * max, puis envoyé par e-mail. La session n'est créée qu'après vérification
 * du code (POST /api/admin/login/verify).
 *
 * Activation : ADMIN_2FA_EMAIL (ou MAIL_TO / SMTP_USER en secours). Si aucune
 * adresse n'est résolue, la double authentification est simplement désactivée
 * et la connexion reste mot de passe seule.
 */

const TTL_MS = 10 * 60 * 1000; //10 minutes
const MAX_ATTEMPTS = 5;

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET manquant ou trop court (32 caractères minimum).");
  }
  return s;
}

/** Destinataire de la double authentification (null →2FA désactivée). */
export function twoFactorEmail(): string | null {
  const email = process.env.ADMIN_2FA_EMAIL || process.env.MAIL_TO || process.env.SMTP_USER || "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

/** Masque l'adresse pour l'affichage côté client : f***@gmail.com. */
export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  const head = user.slice(0, 1);
  return `${head}${"*".repeat(Math.max(2, Math.min(6, user.length - 1)))}@${domain}`;
}

function hashCode(id: string, code: string): string {
  return createHmac("sha256", secret()).update(`${id}:${code}`).digest("hex");
}

/**
 * Crée un défi et retourne l'id + le code en clair.
 * Le code ne doit être TRANSMIS QUE par e-mail ; seule son empreinte est stockée.
 */
export async function createChallenge(): Promise<{ id: string; code: string }> {
  await initDb();
  const id = randomBytes(16).toString("hex");
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const now = Date.now();
  // Purge des défis expirés (quota d'espace sans maintenance manuelle).
  await db().execute({ sql: "DELETE FROM admin_challenges WHERE expires_at < ?", args: [now - TTL_MS] });
  await db().execute({
    sql: "INSERT INTO admin_challenges (id, code_hash, expires_at) VALUES (?, ?, ?)",
    args: [id, hashCode(id, code), now + TTL_MS],
  });
  return { id, code };
}

export type VerifyResult = "ok" | "invalid" | "expired" | "locked";

/** Vérifie un code : usage unique, expiration,5 tentatives maximum. */
export async function verifyChallenge(id: string, code: string): Promise<VerifyResult> {
  if (!/^[0-9]{6}$/.test(code)) return "invalid";
  await initDb();
  const rs = await db().execute({ sql: "SELECT * FROM admin_challenges WHERE id = ?", args: [id] });
  const row = rs.rows[0];
  if (!row) return "invalid";
  if (Number(row.consumed) === 1 || Date.now() > Number(row.expires_at)) return "expired";
  if (Number(row.attempts) >= MAX_ATTEMPTS) return "locked";

  const expected = Buffer.from(String(row.code_hash), "hex");
  const given = Buffer.from(hashCode(id, code), "hex");
  const match = expected.length === given.length && timingSafeEqual(expected, given);

  if (!match) {
    const attempts = Number(row.attempts) + 1;
    await db().execute({ sql: "UPDATE admin_challenges SET attempts = ? WHERE id = ?", args: [attempts, id] });
    return attempts >= MAX_ATTEMPTS ? "locked" : "invalid";
  }

  await db().execute({ sql: "UPDATE admin_challenges SET consumed = 1 WHERE id = ?", args: [id] });
  return "ok";
}

const HTML = (code: string) => `<!doctype html><html lang="fr"><body style="margin:0;background:#050505;font-family:Arial,Helvetica,sans-serif;color:#ffffff">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#0b0b0b;border:1px solid #2a2a2a;border-radius:20px">
<tr><td style="padding:36px 36px 8px;font-size:12px;font-weight:700;letter-spacing:.08em;color:#FF6A00;text-transform:uppercase">Connexion · Espace admin</td></tr>
<tr><td style="padding:0 36px;font-size:30px;line-height:1.1;font-weight:900;color:#FFD000">Ton code de connexion</td></tr>
<tr><td style="padding:20px 36px 4px"><div style="font-size:40px;font-weight:900;letter-spacing:.35em;color:#ffffff;text-align:center;background:#151515;border:1px solid #2a2a2a;border-radius:12px;padding:18px 8px">${code}</div></td></tr>
<tr><td style="padding:8px 36px;font-size:14px;line-height:1.6;color:#a1a1aa">Ce code est valable <strong style="color:#ffffff">10 minutes</strong> et ne peut être utilisé qu'une fois.</td></tr>
<tr><td style="padding:8px 36px 36px;font-size:13px;line-height:1.6;color:#6b6b74">Si ce n'était pas toi, ignore cet e-mail et change ton mot de passe depuis le dashboard.</td></tr>
</table></td></tr></table></body></html>`;

/** Envoie le code de connexion (6 chiffres) par e-mail. */
export async function sendLoginCodeMail(to: string, code: string): Promise<void> {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: mailFrom(),
    to,
    subject: "Ton code de connexion — Nousdev",
    text: `Ton code de connexion : ${code}\nValable10 minutes, utilisable une seule fois.\n\nSi ce n'était pas toi, ignore cet e-mail.`,
    html: HTML(code),
  });
  if (process.env.NODE_ENV !== "production") {
    const url = nodemailer.getTestMessageUrl(info);
    if (url) console.info("[2FA] Aperçu de l'e-mail (Ethereal) :", url);
  }
}
