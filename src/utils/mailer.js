import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

let transporter;

if (GMAIL_USER && GMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASSWORD
    }
  });
} else {
  (async () => {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.info('Uso de una cuenta Ethereal para probar el correo electrónico:', testAccount);
  })();
}

export async function sendMail({ to, subject, html, text }) {
  if (!transporter) {
    throw new Error('Mailer transporter no inicializado');
  }
  const info = await transporter.sendMail({
    from: process.env.GMAIL_USER || '"No Reply" <no-reply@example.com>',
    to,
    subject,
    text,
    html,
  });
  if (info && info.messageId && info.preview) {
    console.log('Email enviado:', info.messageId, 'vista previa:', info.preview);
  }
  return info;
}