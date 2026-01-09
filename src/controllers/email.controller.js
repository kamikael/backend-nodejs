import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service.js';
import prisma from "../lib/prisma.js";

/**
 * Controller pour envoyer l'email de vérification
 */
export async function verifyEmailController(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    // On récupère l'utilisateur correspondant
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Envoi réel de l'email
    const result = await sendVerificationEmail(user.id, email);

    return res.status(200).json({
      message: 'Email de vérification envoyé',
      token: result.token,
      expiresAt: result.expiresAt
    });
  } catch (error) {
    console.error("Erreur verifyEmailController:", error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Controller pour envoyer l'email de réinitialisation de mot de passe
 */
export async function resetPasswordController(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    // On récupère l'utilisateur correspondant
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Envoi réel de l'email
    const result = await sendPasswordResetEmail(user.id, email);

    return res.status(200).json({
      message: 'Email de réinitialisation envoyé',
      token: result.token,
      expiresAt: result.expiresAt
    });
  } catch (error) {
    console.error("Erreur resetPasswordController:", error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
