import prisma from "#lib/prisma";

export class ProfileService {

static async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        emailVerifiedAt: true,
        twoFactorEnabledAt: true,
      },
    });

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    return user;
  }

static async updateProfile(userId, payload) {
  const allowedFields = ["firstName", "lastName"];
  const data = {};

  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      data[key] = payload[key];
    }
  }

  if (Object.keys(data).length === 0) {
    const error = new Error("No valid fields to update");
    error.status = 400;
    throw error;
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      twoFactorEnabledAt: true,
    },
  });
}

static async deleteAccount(userId) {
  return prisma.$transaction(async (tx) => {
    // 1️⃣ Désactiver le compte
    await tx.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        disabledAt: new Date(),
      },
    });

    // 2️⃣ Révoquer toutes les sessions
    await tx.refreshToken.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });

    return true;
  });
}


}