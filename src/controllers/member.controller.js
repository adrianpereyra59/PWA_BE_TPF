import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/environment.config.js';
import MemberWorkspaceRepository from '../repositories/memberWorkspace.repository.js';
import { ServerError } from '../utils/customError.utils.js';

class MemberController {
  static async confirmInvitation(req, res) {
    try {
      const { token } = req.params;
      const payload = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY);
      await MemberWorkspaceRepository.create({ user_id: payload.id_invited, workspace_id: payload.id_workspace, role: 'member', status: 'accepted' });
      return res.redirect(ENVIRONMENT.URL_FRONTEND || '/');
    } catch (error) {
      console.error('confirmInvitation error', error);
      if (error instanceof jwt.JsonWebTokenError) return res.status(400).json({ ok: false, message: 'Invalid token' });
      if (error instanceof jwt.TokenExpiredError) return res.status(400).json({ ok: false, message: 'Token expired' });
      return res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }
}

export default MemberController;