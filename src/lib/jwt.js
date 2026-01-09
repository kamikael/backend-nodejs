import { SignJWT, jwtVerify } from "jose";

const accessSecret = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET
);

const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET
);

const alg = "HS256";

/**
 * 🔐 Access Token (courte durée)
 */
export async function signAccessToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(
      process.env.JWT_ACCESS_EXPIRES_IN || "15m"
    )
    .sign(accessSecret);
}

/**
 * 🔁 Refresh Token (longue durée)
 */
export async function signRefreshToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(
      process.env.JWT_REFRESH_EXPIRES_IN || "7d"
    )
    .sign(refreshSecret);
}

/**
 * ✅ Vérification token (access OU refresh)
 */
export async function verifyToken(token, type = "access") {
  const secret =
    type === "refresh" ? refreshSecret : accessSecret;

  const { payload } = await jwtVerify(token, secret);
  return payload;
}
