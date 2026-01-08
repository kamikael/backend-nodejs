import prisma from "../lib/prisma.js";

export const cleanupExpiredTokens = async () => {
  await prisma.blacklistedAccessToken.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  });

  await prisma.refreshToken.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  });
};
