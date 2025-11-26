import WorkspacesRepository from '../repositories/workspace.repository.js';
import MemberWorkspaceRepository from '../repositories/memberWorkspace.repository.js';
import ChannelRepository from '../repositories/channel.repository.js';
import UserRepository from '../repositories/user.repository.js';
import { ServerError } from '../utils/customError.utils.js';
import { validarId } from '../utils/validations.utils.js';
import * as WorkspaceService from '../services/workspace.service.js';

class WorkspaceController {
  static async getAll(req, res) {
    try {
      const workspaces = await WorkspaceService.listWorkspaces(req.user.id);
      res.json({ ok: true, message: 'Workspaces fetched', data: { workspaces } });
    } catch (err) {
      console.error(err);
      const status = err.status || 500;
      res.status(status).json({ ok: false, message: err.message || 'Internal server error' });
    }
  }

  static async getById(req, res) {
    try {
      const { workspace_id } = req.params;
      if (!validarId(workspace_id)) throw new ServerError(400, 'Invalid workspace id');

      const workspace = await WorkspacesRepository.getById(workspace_id);
      if (!workspace) throw new ServerError(404, 'Workspace not found');

      const channels = await ChannelRepository.getAllByWorkspace(workspace._id);
      res.json({ ok: true, message: 'Workspace', data: { workspace, channels } });
    } catch (err) {
      console.error(err);
      const status = err.status || 500;
      res.status(status).json({ ok: false, message: err.message || 'Internal server error' });
    }
  }

  static async post(req, res) {
    try {
      const { name, url_img } = req.body;
      if (!name || typeof name !== 'string' || name.length > 30) throw new ServerError(400, "Field 'name' required and must be <30 chars");

      const ws = await WorkspacesRepository.createWorkspace(name, url_img);
      await MemberWorkspaceRepository.create({ user_id: req.user.id, workspace_id: ws._id, role: 'admin', status: 'accepted' });

      res.status(201).json({ ok: true, message: 'Workspace created' });
    } catch (err) {
      console.error(err);
      const status = err.status || 500;
      res.status(status).json({ ok: false, message: err.message || 'Internal server error' });
    }
  }

  static async inviteMember(req, res) {
    try {
      const invited_email = req.body.invited_email;
      if (!invited_email) throw new ServerError(400, 'invited_email required');

      const result = await WorkspaceService.inviteMember(req.member, req.workspace, invited_email);
      res.json({ ok: true, message: 'User invited' });
    } catch (err) {
      console.error(err);
      const status = err.status || 500;
      res.status(status).json({ ok: false, message: err.message || 'Internal server error' });
    }
  }
}

export default WorkspaceController;