import express from 'express';
import { isAuthenticated } from '#middlewares/auth.middleware';
import { TwoFactorController } from '#controllers/twofa.controller';

const router = express.Router();

router.post('/enable', isAuthenticated, TwoFactorController.enable);
router.post('/verify', TwoFactorController.verifyTwoFactor);
router.post('/disable', isAuthenticated, TwoFactorController.disable);

export default router;
