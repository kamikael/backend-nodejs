import { Router } from "express";
import { verifyEmailController, resetPasswordController } from "../controllers/email.controller.js";
import { verifyEmailSchema, passwordResetSchema } from "../schemas/email.schema.js";
import { validate } from "../lib/validate.js"; // wrapper Zod pour express

const router = Router();

/**
 * Route pour vérifier / renvoyer l'email de vérification
 */
router.post(
  "/verify-email",
  validate(verifyEmailSchema), // validation du body { email }
  verifyEmailController
);

/**
 * Route pour réinitialiser le mot de passe (forgot password)
 */
router.post(
  "/reset-password",
  validate(passwordResetSchema), // validation du body { email }
  resetPasswordController
);

export default router;
