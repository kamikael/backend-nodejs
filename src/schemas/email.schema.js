import { z } from "zod";

/**
 * Schema pour la vérification d'email
 */
export const verifyEmailSchema = z.object({
  email: z
    .string()
    .email({ message: "L'email doit être valide" }),
});

/**
 * Schema pour la réinitialisation du mot de passe
 */
export const passwordResetSchema = z.object({
  email: z
    .string()
    .email({ message: "L'email doit être valide" }),
});
