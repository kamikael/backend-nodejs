import prisma from '#lib/prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { verifyToken } from '#lib/jwt';

export class TwoFactorService {

  // ✅ Activer 2FA et générer un code unique
  static async enable(userId) {
    // 1️⃣ Générer un code aléatoire à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 2️⃣ Hasher le code avant de le stocker
    const hashedCode = await bcrypt.hash(code, 10);

    // 3️⃣ Mettre à jour l'utilisateur avec le code hashé et la date d'activation
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: hashedCode,
        twoFactorEnabledAt: new Date()
      },
    });

    // 4️⃣ Retourner le code en clair pour l'utilisateur
    return {
      success: true,
      code, // le code que l'utilisateur doit utiliser pour login
      message: 'Votre code 2FA a été généré'
    };
  }

 /**
   * Vérifie le code 2FA en utilisant le tempToken
   * @param {string} tempToken - JWT temporaire généré lors du login
   * @param {string} code - code 2FA saisi par l'utilisateur
   */
  static async verify(tempToken, code) {
    // 1️⃣ Décoder le tempToken pour récupérer l'ID de l'utilisateur
    let payload;
    try {
      payload = await verifyToken(tempToken, '2fa')
    } catch (err) {
      throw new Error('Token temporaire invalide ou expiré');
    }

    const userId = payload.sub;

    // 2️⃣ Récupérer l'utilisateur en base
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) {
      throw new Error('2FA n’est pas activé pour cet utilisateur');
    }

    // 3️⃣ Vérifier le code
    const verified = await bcrypt.compare(code, user.twoFactorSecret);
    if (!verified) throw new Error('Code 2FA invalide');

    return user; // renvoie l'utilisateur si tout est correct
  }

  // ✅ Désactiver le 2FA
  static async disable(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: null,
        twoFactorEnabledAt: null
      }
    });
  }

}
