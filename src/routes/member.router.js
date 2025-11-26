import express from 'express';
import MemberController from '../controllers/member.controller.js';
const router = express.Router();

router.get('/confirm-invitation/:token', MemberController.confirmInvitation);

export default router;