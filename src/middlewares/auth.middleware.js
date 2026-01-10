import prisma from '#lib/prisma';
import { verifyToken } from '#lib/jwt';
import { TokenBlacklistService } from '../services/token-blacklist.service.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    // 1️⃣ Vérifier la présence du header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    // 2️⃣ Vérifier que le token n’est pas blacklisté
    if (await TokenBlacklistService.isBlacklisted(token)) {
      return res.status(401).json({ ok: false, message: 'Token revoked' });
    }

    // 3️⃣ Vérifier la validité du token JWT
    let payload;
    try {
      payload = await verifyToken(token);
    } catch (err) {
      return res.status(401).json({ ok: false, message: 'Invalid token' });
    }

    if (!payload?.sub) {
      return res.status(401).json({ ok: false, message: 'Invalid token payload' });
    }

    // 4️⃣ Vérifier que l’utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      return res.status(401).json({ ok: false, message: 'User not found' });
    }

    // 5️⃣ Vérifier si le compte est désactivé
    if (user.disabledAt) {
      return res.status(403).json({ ok: false, message: 'Account disabled' });
    }

    // 6️⃣ Passer l’utilisateur au controller
    req.user = { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
    next();
  } catch (error) {
    // 7️⃣ Catch général
    next(error);
  }
};
