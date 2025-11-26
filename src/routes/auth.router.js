import express from 'express';
import AuthController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/verify-email/:verification_token', AuthController.verifyEmail);

export default router;