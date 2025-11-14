import express from 'express';
import { body } from 'express-validator';
import validateRequest from '../middleware/validate.js';
import { register, verify, login, forgotPassword, resetPass } from '../controllers/authController.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password too short'),
  ],
  validateRequest,
  register
);

router.get('/verify', verify);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').exists()
  ],
  validateRequest,
  login
);

router.post('/forgot-password', [ body('email').isEmail() ], validateRequest, forgotPassword);

router.post('/reset-password', resetPass);

export default router;