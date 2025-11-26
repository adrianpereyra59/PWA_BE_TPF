import MemberWorkspaceRepository from '../repositories/memberWorkspace.repository.js';
import WorkspacesRepository from '../repositories/workspace.repository.js';
import { ServerError } from '../utils/customError.utils.js';

function workspaceMiddleware(valid_member_roles = []) {
  return async function (req, res, next) {
    try {
      const user = req.user;
      const { workspace_id } = req.params;

      const workspace_selected = await WorkspacesRepository.getById(workspace_id);
      if (!workspace_selected) throw new ServerError(404, 'Workspace not found');

      const member_user_data = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(user.id, workspace_id);
      if (!member_user_data) throw new ServerError(403, 'No permission for this operation');

      if (valid_member_roles.length > 0 && !valid_member_roles.includes(member_user_data.role)) {
        throw new ServerError(403, 'Insufficient permissions');
      }

      req.workspace = workspace_selected;
      req.member = member_user_data;
      next();
    } catch (error) {
      console.log('workspace.middleware error', error);
      if (error.status) {
        return res.status(error.status).json({ ok: false, status: error.status, message: error.message });
      }
      return res.status(500).json({ ok: false, status: 500, message: 'Internal server error' });
    }
  };
}

export default workspaceMiddleware;