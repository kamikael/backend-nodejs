import prisma from "../lib/prisma.js";

export class LoginHistoryService {
  static async record({ userId, ipAddress, userAgent, success }) {
    return prisma.loginHistory.create({
      data: {
        userId,
        ipAddress,
        userAgent,
        success
      }
    });
  }
}
