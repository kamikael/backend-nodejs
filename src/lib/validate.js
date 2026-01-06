import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
    try {
        // Validate request based on what the schema expects
        // We pass the whole request object parts that might be validated
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                ok: false,
                error: "Validation failed",
                details: error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        next(error);
    }
};
