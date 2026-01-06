import { SignJWT, jwtVerify } from 'jose';

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

export const signAccessToken = async (payload) => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(process.env.JWT_ACCESS_EXPIRATION || '15m')
        .sign(getSecret());
};

export const signRefreshToken = async (payload) => {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(process.env.JWT_REFRESH_EXPIRATION || '7d')
        .sign(getSecret());
};

export const verifyToken = async (token) => {
    try {
        const { payload } = await jwtVerify(token, getSecret());
        return payload;
    } catch (error) {
        throw new Error('Invalid token');
    }
};
