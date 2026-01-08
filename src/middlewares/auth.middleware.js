import { verifyToken } from '#lib/jwt';
import { TokenBlacklistService } from "../services/token-blacklist.service.js";

export const requireAuth = async (req, res, next) => {
try {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  if (await TokenBlacklistService.isBlacklisted(token)) {
    return res.status(401).json({ message: "Token revoked" });
  }


    let payload;
  try {
          payload = await verifyToken(token);
        } catch {
            return res.status(401).json({ ok: false, error: 'Invalid token' });
        }

        if (!payload || !payload.sub) {
            return res.status(401).json({ ok: false, error: 'Invalid token payload' });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.sub }
        });

        if (!user) {
            return res.status(401).json({ ok: false, error: 'User not found' });
        }

        // Check if user is disabled
        if (user.disabledAt) {
            return res.status(403).json({ ok: false, error: 'Account disabled' });
        }
    
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
