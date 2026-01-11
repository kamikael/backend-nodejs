import crypto from 'crypto';

/**
 * 🔐 Génère un token aléatoire sécurisé (≥ 1024 caractères)
 */
export function generateToken() {
  // 512 bytes → 1024 caractères hex
  return crypto.randomBytes(512).toString('hex');
}

/**
 * ⏱ Génère un token et sa date d'expiration
 * @param {number} minutes Durée de validité du token en minutes (default 15)
 * @returns {{ token: string, expiresAt: Date }}
 */
export function generateTokenWithExpiry(minutes = 15) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
  return { token, expiresAt };
}
