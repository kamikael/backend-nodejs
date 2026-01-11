import crypto from 'crypto';
import prisma  from '#lib/prisma';
import { hashPassword, verifyPassword } from '#lib/password';
import { signAccessToken, signRefreshToken, verifyToken, signTwoFactorToken } from '#lib/jwt';
import { logger } from '#lib/logger';
import { sendVerificationEmail } from './email.service.js';


export const signup = async ({ email, password, firstName, lastName }) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        const error = new Error('Email already exists');
        error.status = 409;
        throw error;
    }

    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
        },
    });

       // 🔹 Envoi du mail de vérification
    await sendVerificationEmail(user.id, user.email);
    return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName  };
};

export const login = async ({ email, password }, ipAddress, userAgent) => {
  // 1️⃣ Récupérer l'utilisateur
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  // 2️⃣ Vérification email
  if (!user.emailVerifiedAt) {
    const error = new Error('Email non vérifié. Merci de vérifier votre boîte mail.');
    error.status = 403;
    throw error;
  }

  // 3️⃣ Vérification du mot de passe
  const isValid = await verifyPassword(user.password, password);
  if (!isValid) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  // 4️⃣ Vérification si 2FA activé
  if (user.twoFactorEnabledAt) {
    // Ne pas générer les tokens principaux
    // Juste un token temporaire pour vérifier le code 2FA
    const tempToken = await signTwoFactorToken(user.id);

    // 🔹 Historique login réussi (mais code 2FA requis)
      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          ipAddress,
          userAgent,
          success: true,
        },
      });

    return { 
      success: true,
      twoFactorRequired: true,
      tempToken,
      message: 'Two-factor authentication required'
    };
  }

  // 5️⃣ Génération des tokens normaux
  const accessToken = await signAccessToken({ sub: user.id });
  const refreshToken = await signRefreshToken({ sub: user.id });

  // 6️⃣ Stockage du refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      userAgent,
      ipAddress,
    },
  });

  // 7️⃣ Retour formaté
  return {
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }
  };
};



export const refresh = async (token) => {
    // Check if token exists in DB and is valid
    // verifyToken will throw if signature is invalid or expired
    const payload = await verifyToken(token, "refresh");

    const savedToken = await prisma.refreshToken.findUnique({
        where: { token },
    });

    if (!savedToken || savedToken.revokedAt || new Date() > savedToken.expiresAt) {
        const error = new Error('Invalid refresh token');
        error.status = 401;
        throw error;
    }

    const accessToken = await signAccessToken({ sub: payload.sub });
    const newRefreshToken = await signRefreshToken({ sub: payload.sub });

    // Rotate token: verify we are replacing the specific token we derived from
    // Transaction helps atomicity
    await prisma.$transaction([
        prisma.refreshToken.update({
            where: { id: savedToken.id },
            data: { revokedAt: new Date() },
        }),
        prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: payload.sub,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }
        })
    ]);

    return { accessToken, refreshToken: newRefreshToken };
};

export const logout = async ({ refreshToken, accessToken }) => {
  // -------------------------------
  // 1️⃣ Révoquer la session
  // -------------------------------
  if (refreshToken) {
    try {
      await prisma.refreshToken.update({
        where: { token: refreshToken },
        data: { revokedAt: new Date() },
      });
    } catch {
      // token inexistant ou déjà révoqué → OK
    }
  }

  // -------------------------------
  // 2️⃣ Blacklist access token NORMAL
  // -------------------------------
  if (accessToken) {
    try {
      const payload = await verifyToken(accessToken);

      // 🚫 NE PAS blacklist les tokens temporaires 2FA
      if (payload.twoFactor === true) {
        return;
      }

      await prisma.blacklistedAccessToken.create({
        data: {
          token: accessToken,
          userId: payload.sub,
          expiresAt: new Date(payload.exp * 1000),
        },
      });
    } catch {
      // token invalide / expiré → OK
    }
  }
};

export const changePassword = async (userId, { oldPassword, newPassword }) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user.password) {
        const error = new Error('User has no password set');
        error.status = 400;
        throw error;
    }

    const isValid = await verifyPassword(user.password, oldPassword);
    if (!isValid) {
        const error = new Error('Invalid old password');
        error.status = 401;
        throw error;
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
};

export const forgotPassword = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return;
    }

    const token = crypto.randomUUID();

    await prisma.passwordResetToken.create({
        data: {
            token,
            userId: user.id,
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
        }
    });

    logger.info(`[MOCK EMAIL] Password reset token for ${email}: ${token}`);
};

export const resetPassword = async ({ token, password }) => {
    const savedToken = await prisma.passwordResetToken.findUnique({
        where: { token },
    });

    if (!savedToken || new Date() > savedToken.expiresAt) {
        const error = new Error('Invalid or expired token');
        error.status = 400;
        throw error;
    }

    const hashedPassword = await hash(password);

    await prisma.$transaction([
        prisma.user.update({
            where: { id: savedToken.userId },
            data: { password: hashedPassword }
        }),
        prisma.passwordResetToken.delete({
            where: { id: savedToken.id }
        })
    ]);
};
