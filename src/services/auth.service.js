import crypto from 'crypto';
import { prisma } from '#lib/prisma';
import { hash, verify } from '#lib/password';
import { signAccessToken, signRefreshToken, verifyToken } from '#lib/jwt';
import { logger } from '#lib/logger';

export const signup = async ({ email, password, name }) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        const error = new Error('Email already exists');
        error.status = 409;
        throw error;
    }

    const hashedPassword = await hash(password);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });

    return { id: user.id, email: user.email, name: user.name };
};

export const login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }

    const isValid = await verify(user.password, password);
    if (!isValid) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }

    const accessToken = await signAccessToken({ sub: user.id });
    const refreshToken = await signRefreshToken({ sub: user.id });

    // Store refresh token
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
    });

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name } };
};

export const refresh = async (token) => {
    // Check if token exists in DB and is valid
    // verifyToken will throw if signature is invalid or expired
    const payload = await verifyToken(token);

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

export const logout = async (token) => {
    if (!token) return;
    try {
        await prisma.refreshToken.update({
            where: { token },
            data: { revokedAt: new Date() },
        });
    } catch (err) {
        // Ignore if token not found or already revoked/etc
    }
};

export const changePassword = async (userId, { oldPassword, newPassword }) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user.password) {
        const error = new Error('User has no password set');
        error.status = 400;
        throw error;
    }

    const isValid = await verify(user.password, oldPassword);
    if (!isValid) {
        const error = new Error('Invalid old password');
        error.status = 401;
        throw error;
    }

    const hashedPassword = await hash(newPassword);

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
