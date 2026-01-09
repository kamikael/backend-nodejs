import nodemailer from "nodemailer";
import prisma from "../lib/prisma.js";
import { generateTokenWithExpiry } from "./token.service.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false, // true si port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});


/**
 * Envoi d'un email
 */
async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html
  });
}


/**
 * Envoie email de vérification
 */
export async function sendVerificationEmail(userId, email) {
  const { token, expiresAt } = generateTokenWithExpiry();

  // Enregistrement en BDD
  await prisma.verificationToken.create({
    data: { token, userId, expiresAt }
  });

  // Envoi réel de l'email
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Vérifiez votre email",
    html: `
      <p>Bonjour,</p>
      <p>Merci de vous inscrire. Cliquez sur le lien ci-dessous pour vérifier votre email :</p>
      <a href="${url}">Vérifier mon email</a>
      <p>Ce lien expirera le ${expiresAt.toLocaleString()}</p>
    `
  });

  return { token, expiresAt };
}

/**
 * Envoie email de réinitialisation du mot de passe
 */
export async function sendPasswordResetEmail(userId, email) {
  const { token, expiresAt } = generateTokenWithExpiry();

  // Enregistrement en BDD
  await prisma.passwordResetToken.create({
    data: { token, userId, expiresAt }
  });

  // Envoi réel de l'email
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Réinitialisez votre mot de passe",
    html: `
      <p>Bonjour,</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous :</p>
      <a href="${url}">Réinitialiser mon mot de passe</a>
      <p>Ce lien expirera le ${expiresAt.toLocaleString()}</p>
    `
  });

  return { token, expiresAt };
}
