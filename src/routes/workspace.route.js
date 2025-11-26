import express from 'express';
import WorkspaceController from '../controllers/workspace.controller.js';
import authMiddleware, { authByRoleMiddleware } from '../middleware/auth.middleware.js';
import workspaceMiddleware from '../middleware/workspace.middleware.js';
import ChannelController from '../controllers/channel.controller.js';
import channelMiddleware from '../middleware/channel.middleware.js';
import MessageController from '../controllers/message.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', WorkspaceController.getAll);
router.get('/:workspace_id', WorkspaceController.getById);
router.post('/:workspace_id/invite', workspaceMiddleware(['admin']), WorkspaceController.inviteMember);

router.post('/:workspace_id/channels/', workspaceMiddleware([]), ChannelController.create);
router.get('/:workspace_id/channels/', workspaceMiddleware([]), ChannelController.getAllByWorkspace);

router.get('/:workspace_id/channels/:channel_id/messages', workspaceMiddleware([]), channelMiddleware, MessageController.getAllByChannel);
router.post('/:workspace_id/channels/:channel_id/messages', workspaceMiddleware([]), channelMiddleware, MessageController.create);

router.post('/', WorkspaceController.post);

export default router;