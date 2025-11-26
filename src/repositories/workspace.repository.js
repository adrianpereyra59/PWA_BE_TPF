import Workspaces from '../models/Workspace.model.js';

class WorkspacesRepository {
  static async createWorkspace(name, url_image) {
    const ws = new Workspaces({ name, url_image });
    const saved = await ws.save();
    return saved;
  }

  static async getAll() {
    return Workspaces.find({ active: true }).exec();
  }

  static async getById(workspace_id) {
    return Workspaces.findById(workspace_id).exec();
  }

  static async deleteById(workspace_id) {
    return Workspaces.findByIdAndDelete(workspace_id).exec();
  }

  static async updateById(workspace_id, new_values) {
    return Workspaces.findByIdAndUpdate(workspace_id, new_values, { new: true }).exec();
  }
}

export default WorkspacesRepository;