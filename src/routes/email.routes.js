import express from 'express';
import { verifyEmailController, resetPasswordController } from '../controllers/email.controller.js';

const router = express.Router();

/**
 * Route pour envoyer l'email de vérification
 * POST /email/verify
 */
router.post('/verify', verifyEmailController);

/**
 * Route pour envoyer l'email de réinitialisation de mot de passe
 * POST /email/reset
 */
router.post('/reset', resetPasswordController);

export default router;
