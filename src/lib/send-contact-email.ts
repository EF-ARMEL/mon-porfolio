import nodemailer from 'nodemailer';

interface ContactData {
  nom: string;
  email: string;
  tel: string;
  projet: string;
  budget: string;
  delai: string;
  message: string;
}

/**
 * Service d'envoi d'emails pour le formulaire de contact.
 * Utilise Nodemailer pour envoyer les données vers l'email de l'administrateur.
 */
export async function sendContactEmail(data: ContactData) {
  // Transporteur SMTP : mêmes variables que le quiz (SMTP_*), présentes dans .env.local.
  const host = process.env.SMTP_HOST;
  if (!host) {
    // Sans SMTP configuré en dev, on n'émet pas d'erreur : le message est déjà en base.
    if (process.env.NODE_ENV === "production") throw new Error("SMTP_HOST manquant en production.");
    console.warn("[contact] SMTP non configuré : e-mail de notification ignoré (message en base).");
    return;
  }

  const port = Number(process.env.SMTP_PORT ?? 465);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });

  const mailOptions = {
    from: process.env.MAIL_FROM || '"Portfolio NousDev" <noreply@nousdev.com>',
    // Destinataire : MAIL_TO si défini, sinon l'expéditeur SMTP lui-même.
    to: process.env.MAIL_TO || process.env.SMTP_USER || 'votre-email@exemple.com',
    subject: `🚀 Nouveau projet : ${data.projet} - ${data.nom}`,
    text: `
      Nouveau message reçu via le portfolio :

      Nom : ${data.nom}
      Email : ${data.email}
      Téléphone : ${data.tel}
      Projet : ${data.projet}
      Budget : ${data.budget}
      Délai : ${data.delai}

      Message :
      ${data.message}
    `,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #ff6a00;">🚀 Nouveau projet : ${data.projet}</h2>
        <p><strong>Nom :</strong> ${data.nom}</p>
        <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Téléphone :</strong> ${data.tel}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Type de projet :</strong> ${data.projet}</p>
        <p><strong>Budget :</strong> ${data.budget}</p>
        <p><strong>Délai :</strong> ${data.delai}</p>
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #ff6a00; margin-top: 20px;">
          <strong>Message :</strong><br />
          ${data.message.replace(/\n/g, '<br />')}
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}
