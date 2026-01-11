import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";
import { env } from "#config/env";

const accessSecret = new TextEncoder().encode(
  env.JWT.ACCESS_SECRET
);

const refreshSecret = new TextEncoder().encode(
  env.JWT.REFRESH_SECRET
);

const alg = "HS256";

/**
 * 🔐 Génère de l'entropie pour allonger le JWT
 */
function generateEntropy(size = 48) {
  // 48 bytes → 96 caractères hex
  return crypto.randomBytes(size).toString("hex");
}

/**
 * 🔐 Token temporaire 2FA (≥ 250 caractères)
 */
export async function signTwoFactorToken(userId) {
  return new SignJWT({
    sub: userId,
    type: "2fa",
    jti: crypto.randomUUID(),
    rnd: generateEntropy(32),
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(accessSecret);
}

/**
 * 🔐 Access Token (≥ 250 caractères)
 */
export async function signAccessToken(payload) {
  return new SignJWT({
    ...payload,
    type: "access",
    jti: crypto.randomUUID(),
    rnd: generateEntropy(32),
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(
      env.JWT.ACCESS_EXPIRATION || "15m"
    )
    .sign(accessSecret);
}

/**
 * 🔁 Refresh Token (≥ 250 caractères)
 */
export async function signRefreshToken(payload) {
  return new SignJWT({
    ...payload,
    type: "refresh",
    jti: crypto.randomUUID(),
    rnd: generateEntropy(48), // encore plus long
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(
      env.JWT.REFRESH_EXPIRATION || "7d"
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
