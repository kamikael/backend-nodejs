import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "#config/env";
/**
 * Passport ne fait qu'une chose :
 * - Authentifier Google
 * - Fournir le profile utilisateur
 * Toute la logique métier est déportée dans oauth.service.js
 */

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE.CLIENT_ID,
clientSecret: env.GOOGLE.CLIENT_SECRET,
callbackURL: env.GOOGLE.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // ✅ Ne PAS toucher à la BDD ici
        // ✅ Juste renvoyer le profile Google

        return done(null, profile);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
