import crypto from 'crypto';

/**
 * Génère un token aléatoire sécurisé
 */
export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Génère un token et sa date d'expiration
 * @param {number} minutes Durée de validité du token en minutes (default 15)
 * @returns {Object} { token: string, expiresAt: Date }
 */
export function generateTokenWithExpiry(minutes = 15) {
  const token = generateToken(); // utilise la fonction generateToken
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000); // ajoute les minutes
  return { token, expiresAt };
}
