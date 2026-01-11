import { z } from 'zod'

export const signupSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8, "Password must be at least 8 characters"),
        firstName: z.string().min(1),
        lastName: z.string().min(1)
});

export const loginSchema = z.object({
        email: z.string().email(),
        password: z.string(),
});

export const refreshTokenSchema = z.object({
        refreshToken: z.string(),
});

export const changePasswordSchema = z.object({
        oldPassword: z.string(),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),

});

export const forgotPasswordSchema = z.object({
        email: z.string().email(),
});

export const resetPasswordSchema = z.object({
        token: z.string(),
        password: z.string().min(8, "Password must be at least 8 characters"),

});
