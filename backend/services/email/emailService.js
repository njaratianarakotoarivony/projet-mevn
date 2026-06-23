// Service email partagé (Nodemailer).
// Prérequis des flux « reset password » et notifications.
//
// En l'absence de configuration SMTP, on bascule sur un transport « console »
// (les emails sont loggés au lieu d'être envoyés) afin de ne pas bloquer le
// développement local.
import nodemailer from 'nodemailer';

let cachedTransporter = null;

const buildTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST) {
    console.warn(
      '[email] Aucun SMTP_HOST configuré — mode console (emails non envoyés).'
    );
    return nodemailer.createTransport({ jsonTransport: true });
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
};

const getTransporter = () => {
  if (!cachedTransporter) {
    cachedTransporter = buildTransporter();
  }
  return cachedTransporter;
};

// Envoie un email. Retourne l'info du transport (utile en tests).
export const sendEmail = async ({ to, subject, text, html }) => {
  const from = process.env.EMAIL_FROM || 'no-reply@hotel.com';
  const info = await getTransporter().sendMail({ from, to, subject, text, html });

  // En mode console, le contenu est dans info.message (jsonTransport).
  if (info.message) {
    console.log(`[email] (non envoyé) à ${to} — ${subject}`);
  }
  return info;
};

export default { sendEmail };
