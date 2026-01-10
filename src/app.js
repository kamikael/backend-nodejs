import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

import { cleanupExpiredTokens } from "./services/cleanup.service.js";
import { logger, httpLogger } from "#lib/logger";
import { errorHandler } from "#middlewares/error-handler";
import { notFoundHandler } from "#middlewares/not-found";
import authRoutes from "#routes/auth.routes";
import emailRoutes from "./routes/email.routes.js";
import sessionRoutes from "#routes/session.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(httpLogger);
app.use(express.json());

// Nettoyage async au démarrage
(async () => {
  try {
    await cleanupExpiredTokens();
    console.log("Expired tokens cleaned");
  } catch (err) {
    console.error("Cleanup failed", err);
  }
})();

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PAI Express opérationnelle"
  });
});

 app.use('/auth', authRoutes);
 app.use("/email", emailRoutes);
  app.use("/sessions", sessionRoutes);

// Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;