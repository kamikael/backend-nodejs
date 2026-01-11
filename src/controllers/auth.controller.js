import * as authService from '#services/auth.service';
import prisma from '#lib/prisma';

export const signup = async (req, res) => {
    const user = await authService.signup(req.body);
    res.status(201).json({ ok: true, data: user });
};

export const login = async (req, res, next) => {
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  try {
    const data = await authService.login(req.body, ipAddress, userAgent);

    // 🔹 Login SUCCESS → historique seulement si user identifié (pas 2FA pending)
    if (data.user?.id) {
      await prisma.loginHistory.create({
        data: {
          userId: data.user.id,
          ipAddress,
          userAgent,
          success: true,
        },
      });
    }

    // 🔹 Réponse adaptée
    if (data.twoFactorRequired) {
      return res.status(200).json({
        ok: true,
        twoFactorRequired: true,
        tempToken: data.tempToken,
        message: 'Two-factor authentication required',
      });
    }

    return res.status(200).json({
      ok: true,
      data,
    });
  } catch (error) {
    // ❌ Login FAILED → historique
    try {
      await prisma.loginHistory.create({
        data: {
          ipAddress,
          userAgent,
          success: false,
          userId: error.userId || null, // optionnel si on a l'ID
        },
      });
    } catch (_) {
      // ne jamais bloquer la réponse à cause du logging
    }

    return res.status(error.status || 401).json({
      ok: false,
      message: error.message || 'Invalid credentials',
    });
  }
};



export const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    const data = await authService.refresh(refreshToken);
    res.status(200).json({ ok: true, data });
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    const accessToken =
      req.headers.authorization?.split(" ")[1];

    await authService.logout({ refreshToken, accessToken });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res) => {
    // req.user from auth middleware
    await authService.changePassword(req.user.id, req.body);
    res.status(200).json({ ok: true, message: 'Password changed successfully' });
};

export const forgotPassword = async (req, res) => {
    await authService.forgotPassword(req.body.email);
    // Always return success to prevent enumeration
    res.status(200).json({ ok: true, message: 'If email exists, reset instructions have been sent' });
};

export const resetPassword = async (req, res) => {
    await authService.resetPassword(req.body);
    res.status(200).json({ ok: true, message: 'Password reset successfully' });
};




