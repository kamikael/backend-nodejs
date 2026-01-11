import { Router } from "express";
import { resetPasswordController } from "#controllers/email.controller";
import { passwordResetSchema } from "#schemas/email.schema";
import { validate } from "../lib/validate.js"; // wrapper Zod pour express
import { verifyEmailTokenController } from "#controllers/email.controller";

const router = Router();

router.get("/verify", verifyEmailTokenController);


/**
 * Route pour réinitialiser le mot de passe (forgot password)
 */
router.post(
  "/reset-password",
  validate(passwordResetSchema), // validation du body { email }
  resetPasswordController
);

export default router;
