import nodemailer from "nodemailer";
import prisma from "../lib/prisma.js";
import { generateTokenWithExpiry } from "./token.service.js";
import {env} from '#config/env'

const transporter = nodemailer.createTransport({
  host: env.SMTP.HOST,
  port: env.SMTP.PORT,
  secure: false,
  auth: {
    user: env.SMTP.USER,
    pass: env.SMTP.PASS,
  },
});


/**
 * Envoi d'un email
 */
async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: env.SMTP.FROM,
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
  const url = `${env.FRONTEND_URL}/email/verify?token=${token}`;
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
  const url = `${env.FRONTEND_URL}/email/reset-password?token=${token}`;
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
