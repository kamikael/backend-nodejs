import prisma from "#lib/prisma";
import { signAccessToken, signRefreshToken } from "#lib/jwt";

export class OAuthService {
  static async handleGoogleLogin(profile, ipAddress, userAgent) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      const error = new Error("Google account has no email");
      error.status = 400;
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      const oauthAccount = await tx.oAuthAccount.findUnique({
        where: {
          provider_providerId: {
            provider: "google",
            providerId: profile.id,
          },
        },
        include: { user: true },
      });

      let user;

      if (oauthAccount) {
        user = oauthAccount.user;

        if (user.disabledAt) {
          const error = new Error("Account is disabled");
          error.status = 403;
          throw error;
        }
      } else {
        user = await tx.user.findUnique({ where: { email } });

        if (!user) {
          user = await tx.user.create({
            data: {
              email,
              firstName: profile.name?.givenName ?? "",
              lastName: profile.name?.familyName ?? "",
              emailVerifiedAt: new Date(),
            },
          });
        } else if (user.disabledAt) {
          const error = new Error("Account is disabled");
          error.status = 403;
          throw error;
        }

        await tx.oAuthAccount.create({
          data: {
            provider: "google",
            providerId: profile.id,
            userId: user.id,
          },
        });
      }

      // ------------------------------
      // 2FA check (Dev 5)
      // ------------------------------
      if (user.twoFactorEnabledAt) {

         await tx.loginHistory.create({
           data: {
      userId: user.id,
      ipAddress,
      userAgent,
      success: false, // ❗ pas encore authentifié
      reason: "2FA_REQUIRED",
    },
  });
        // Générer un token temporaire valide 5 min
        const tempToken = await signAccessToken(
          { sub: user.id, twoFactor: true },
          { expiresIn: "5m" }
        );

        // On ne génère pas les vrais tokens ni la session
        return {
          twoFactorRequired: true,
          tempToken,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        };
      }

      // ------------------------------
      // Génération tokens définitifs
      // ------------------------------
      const accessToken = await signAccessToken({ sub: user.id });
      const refreshToken = await signRefreshToken({ sub: user.id });

      await tx.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          ipAddress,
          userAgent,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      // ✅ LOGIN RÉUSSI
await tx.loginHistory.create({
  data: {
    userId: user.id,
    ipAddress,
    userAgent,
    success: true,
  },
});


      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    });
  }
}
