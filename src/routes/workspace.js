import express from 'express';
import { body } from 'express-validator';
import validateRequest from '../middleware/validate.js';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  list, create, getOne, del, addUser, deleteUser, updateRole
} from '../controllers/workspaceController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', list);

router.post(
  '/',
  [ body('name').notEmpty().withMessage('Name required') ],
  validateRequest,
  create
);

router.get('/:id', getOne);

router.delete('/:id', del);

router.post('/:id/users', [ body('email').isEmail() ], validateRequest, addUser);

router.delete('/:id/users/:userId', deleteUser);

router.put('/:id/users/:userId/role', [ body('role').isIn(['admin','member','viewer']) ], validateRequest, updateRole);

export default router;