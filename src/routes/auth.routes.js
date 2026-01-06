import { Router } from 'express';
import { validate } from '#lib/validate';
import { asyncHandler } from '#lib/async-handler';
import { isAuthenticated } from '#middlewares/auth.middleware';
import * as authController from '#controllers/auth.controller';
import * as schema from '#schemas/auth.schema';

const router = Router();

router.post('/signup', validate(schema.signupSchema), asyncHandler(authController.signup));
router.post('/login', validate(schema.loginSchema), asyncHandler(authController.login));
router.post('/refresh', validate(schema.refreshTokenSchema), asyncHandler(authController.refresh));
router.post('/logout', asyncHandler(authController.logout));

router.post('/change-password', isAuthenticated, validate(schema.changePasswordSchema), asyncHandler(authController.changePassword));

router.post('/forgot-password', validate(schema.forgotPasswordSchema), asyncHandler(authController.forgotPassword));
router.post('/reset-password', validate(schema.resetPasswordSchema), asyncHandler(authController.resetPassword));

export default router;
