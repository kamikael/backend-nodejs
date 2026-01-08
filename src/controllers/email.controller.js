import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service.js';

/**
 * Controller pour envoyer l'email de vérification
 */
export async function verifyEmailController(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    const result = sendVerificationEmail(email);

    return res.status(200).json({
      message: 'Email de vérification envoyé (mock)',
      token: result.token,
      expiresAt: result.expiresAt
    });
  } catch (error) {
    console.error(error);
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

    const result = sendPasswordResetEmail(email);

    return res.status(200).json({
      message: 'Email de réinitialisation envoyé (mock)',
      token: result.token,
      expiresAt: result.expiresAt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
