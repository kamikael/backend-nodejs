import { OAuthService } from "#services/oauth.service";

export class OAuthController {
  static async googleCallback(req, res, next) {
    try {
      // 🛑 Sécurité : Passport n'a pas fourni de profile
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Google authentication failed",
        });
      }

      // 🌍 Infos de session
      const ipAddress =
        req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
      const userAgent = req.headers["user-agent"] || "unknown";

      // 🔐 OAuth Login
      const result = await OAuthService.handleGoogleLogin(
        req.user,
        ipAddress,
        userAgent
      );
    

      // ✅ Réponse standardisée
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
