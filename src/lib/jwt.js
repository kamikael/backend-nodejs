import { SignJWT, jwtVerify } from "jose";

const accessSecret = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET
);

const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET
);

const alg = "HS256";

/**
 * 🔐 Token temporaire 2FA
 */
export async function signTwoFactorToken(userId) {
  return new SignJWT({
    sub: userId,
    type: "2fa",
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(accessSecret);
}

/**
 * 🔐 Access Token
 */
export async function signAccessToken(payload) {
  return new SignJWT({
    ...payload,
    type: "access",
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(
      process.env.JWT_ACCESS_EXPIRES_IN || "15m"
    )
    .sign(accessSecret);
}

/**
 * 🔁 Refresh Token
 */
export async function signRefreshToken(payload) {
  return new SignJWT({
    ...payload,
    type: "refresh",
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(
      process.env.JWT_REFRESH_EXPIRES_IN || "7d"
    )
    .sign(refreshSecret);
}

/**
 * ✅ Vérification token typé
 */
export async function verifyToken(token, expectedType = "access") {
  const secret =
    expectedType === "refresh" ? refreshSecret : accessSecret;

  const { payload } = await jwtVerify(token, secret);

  if (payload.type !== expectedType) {
    const error = new Error("Invalid token type");
    error.status = 401;
    throw error;
  }

  return payload;
}
