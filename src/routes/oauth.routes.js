import express from 'express';
import passport from 'passport';
import { OAuthController } from '../controllers/oauth.controller.js';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  OAuthController.googleCallback
);

export default router;
