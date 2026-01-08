import { generateTokenWithExpiry } from './token.service.js';

/**
 * Envoie un email de vérification (mock)
 * @param {string} email - l'email du user
 * @returns {Object} token + expiration
 */
export function sendVerificationEmail(email) {
  const { token, expiresAt } = generateTokenWithExpiry(); // génère token + expiration

  // Ici on "envoie" l'email (mock)
  console.log(`📧 Email de vérification pour ${email}`);
  console.log(`Token: ${token}`);
  console.log(`Expire à: ${expiresAt}`);

  // TODO plus tard : enregistrer le token dans la base (VerificationToken)
  return { token, expiresAt };
}

/**
 * Envoie un email pour réinitialiser le mot de passe (mock)
 * @param {string} email - l'email du user
 * @returns {Object} token + expiration
 */
export function sendPasswordResetEmail(email) {
  const { token, expiresAt } = generateTokenWithExpiry(); // génère token + expiration

  // Ici on "envoie" l'email (mock)
  console.log(`📧 Email de réinitialisation pour ${email}`);
  console.log(`Token: ${token}`);
  console.log(`Expire à: ${expiresAt}`);

  // TODO plus tard : enregistrer le token dans la base (PasswordResetToken)
  return { token, expiresAt };
}
