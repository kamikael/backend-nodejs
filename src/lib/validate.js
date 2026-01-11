import { ValidationException } from "#lib/exceptions";

/**
 * Middleware Express de validation avec Zod
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    throw new ValidationException(
      "Validation Failed",
      result.error.flatten().fieldErrors
    );
  }

  req.body = result.data; // données validées
  next();
};
