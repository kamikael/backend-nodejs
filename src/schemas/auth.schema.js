import { z } from 'zod';
//ybybdy
export const signupSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8, "Password must be at least 8 characters"),
        name: z.string().min(2).optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z.string(),
    }),
});

export const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string(),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
    }),
});

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email(),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string(),
        password: z.string().min(8, "Password must be at least 8 characters"),
    }),
});
