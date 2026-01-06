import { verifyToken } from '#lib/jwt';
import { prisma } from '#lib/prisma';

export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ ok: false, error: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];

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

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
