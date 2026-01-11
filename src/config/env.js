import dotenv from "dotenv";

// Charge le fichier .env
dotenv.config();

/**
 * 🔐 Récupère une variable d'environnement obligatoire
 */
function required(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`❌ Missing environment variable: ${name}`);
  }

  return value;
}

/**
 * ⚙️ Configuration centralisée de l'application
 */
export const env = {
  // 🌍 App
  PORT: Number(process.env.PORT || 3000),
  NODE_ENV: process.env.NODE_ENV || "development",

  // 🗄️ Database
  DATABASE_URL: required("DATABASE_URL"),

  // 🔐 JWT
  JWT: {
    ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
    REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
    ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || "15m",
    REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || "7d",
  },

  // 📧 Email / SMTP
  SMTP: {
    HOST: required("SMTP_HOST"),
    PORT: Number(required("SMTP_PORT")),
    USER: required("SMTP_USER"),
    PASS: required("SMTP_PASS"),
    FROM: required("EMAIL_FROM"),
  },

  // 🌐 URLs
  FRONTEND_URL: required("FRONTEND_URL"),

  // 🔑 OAuth Google
  GOOGLE: {
    CLIENT_ID: required("GOOGLE_CLIENT_ID"),
    CLIENT_SECRET: required("GOOGLE_CLIENT_SECRET"),
    CALLBACK_URL: required("GOOGLE_CALLBACK_URL"),
  },
};
