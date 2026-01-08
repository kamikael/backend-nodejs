import prisma from "../lib/prisma.js";

export class TokenBlacklistService {
  static async blacklist(token, userId, expiresAt) {
    return prisma.blacklistedAccessToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });
  }

  static async isBlacklisted(token) {
    const found = await prisma.blacklistedAccessToken.findUnique({
      where: { token }
    });

    return !!found;
  }
}
