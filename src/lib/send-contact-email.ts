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
  // Configuration du transporteur.
  // En production, utilisez des variables d'environnement pour la sécurité.
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Portfolio NousDev" <noreply@nousdev.com>',
    to: process.env.EMAIL_TO || 'votre-email@exemple.com',
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
