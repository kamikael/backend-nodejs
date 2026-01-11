import prisma from '#lib/prisma';
import { TwoFactorService } from '#services/twofa.service';
import { signAccessToken, signRefreshToken } from '#lib/jwt';

export class TwoFactorController {
  static async enable(req, res) {
    const data = await TwoFactorService.enable(req.user.id);
    res.json({ success: true, data });
  }

  static async verifyTwoFactor(req, res, next) {

    const { tempToken, code } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  try {
    // 1️⃣ Vérifier le code 2FA avec le tempToken
    const user = await TwoFactorService.verify(tempToken, code);

    // 2️⃣ Générer les vrais tokens
    const accessToken = await signAccessToken({ sub: user.id });
    const refreshToken = await signRefreshToken({ sub: user.id });

    // 3️⃣ Stocker le refresh token en base (whitelist)
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
        userAgent,
        ipAddress,
      },
    });

    // 🔹 Historique login réussi (mais code 2FA requis)
      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          ipAddress,
          userAgent,
          success: true,
        },
      });

    // 4️⃣ Réponse au client
    return res.status(200).json({
      ok: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: '2FA validé, vous êtes connecté',
    });
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: error.message || 'Code 2FA invalide',
    });
  }
}
  

  static async disable(req, res) {
    await TwoFactorService.disable(req.user.id);
    res.json({ success: true, message: '2FA disabled' });
  }
}
