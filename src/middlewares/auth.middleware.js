import prisma from "#lib/prisma";
import { verifyToken } from "#lib/jwt";
import { TokenBlacklistService } from "../services/token-blacklist.service.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    // 1️⃣ Vérifier la présence du header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Vérifier que le token n’est pas blacklisté
    if (await TokenBlacklistService.isBlacklisted(token)) {
      return res.status(401).json({ success: false, message: "Token revoked" });
    }

    // 3️⃣ Vérifier la validité du token JWT
    let payload;
    try {
      payload = await verifyToken(token, "access");
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    if (!payload?.sub) {
      return res.status(401).json({ success: false, message: "Invalid token payload" });
    }

    // 4️⃣ Vérifier que l’utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // 5️⃣ Vérifier si le compte est désactivé
    if (user.deletedAt || user.disabledAt) {
  return res.status(403).json({
    success: false,
    message: "Account is disabled",
  });
}

    // 6️⃣ Gérer le flow 2FA
    // payload.twoFactor = true => token temporaire 2FA
    if (payload.twoFactor) {
      // Autoriser uniquement les routes 2FA
      if (!req.path.startsWith("/2fa")) {
        return res.status(403).json({
          success: false,
          message: "Two-factor authentication required",
        });
      }
    }

    // 7️⃣ Passer l’utilisateur au controller
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      twoFactorEnabledAt: user.twoFactorEnabledAt,
      twoFactorSecret: user.twoFactorSecret,
      isTempToken: !!payload.twoFactor, // flag pour savoir si c'est un token temporaire
    };

    next();
  } catch (error) {
    // 8️⃣ Catch général
    next(error);
  }
};
