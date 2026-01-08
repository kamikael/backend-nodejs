import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import { cleanupExpiredTokens } from "./services/cleanup.service.js";

dotenv.config()

import { logger, httpLogger } from "#/lib/logger"
import {errorHandler } from "#middlawares/error-handler"
import {notFoundHandler} from "#middlewares/not-found"

const app = express()
const PORT = process.env.PORT || 3000

//Middlewares
app.use(helmet())
app.use(cors())
app.use(httpLogger)
app.use(express.json())

// 🔥 nettoyage au démarrage
(async () => {
  try {
    await cleanupExpiredTokens();
    console.log("Expired tokens cleaned");
  } catch (err) {
    console.error("Cleanup failed", err);
  }
})();

//routes
app.get("/", (res, req)=>{
 res.json({
    success: true,
    message: "PAI Express operationnelle"
 })
})

app.use(notFoundHandler)
// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Serveur démarré sur <http://localhost>:${PORT}`);
});