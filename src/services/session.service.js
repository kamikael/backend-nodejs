import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export class SessionService {
  static async listSessions(userId) {
    return prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true
      }
    });
  }

  static async revokeSession(sessionId, userId) {
    return prisma.refreshToken.updateMany({
      where: {
        id: sessionId,
        userId,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });
  }

  static async revokeAllExceptCurrent(userId, currentToken) {
    const decoded = jwt.decode(currentToken);

    return prisma.refreshToken.updateMany({
      where: {
        userId,
        token: { not: currentToken },
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });
  }
}
