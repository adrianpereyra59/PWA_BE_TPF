import MemberWorkspace from '../models/MemberWorkspace.model.js';
import mongoose from 'mongoose';
import { ServerError } from '../utils/customError.utils.js';

class MemberWorkspaceRepository {
  static async getAllByWorkspaceId(workspace_id) {
    return MemberWorkspace.find({ workspace: workspace_id }).populate('user workspace').exec();
  }

  static async getAllByUserId(user_id) {
    return MemberWorkspace.find({ user: user_id }).populate('workspace').exec();
  }

  static async getById(member_id) {
    return MemberWorkspace.findById(member_id).populate('user workspace').exec();
  }

  static async getMemberWorkspaceByUserIdAndWorkspaceId(user_id, workspace_id) {
    if (!user_id) return null;
    return MemberWorkspace.findOne({ user: user_id, workspace: workspace_id }).populate('user workspace').exec();
  }

  static async create({ user_id = null, email = null, workspace_id, role = 'member', status = 'pending' }) {
    if (user_id) {
      const existing = await MemberWorkspace.findOne({ user: user_id, workspace: workspace_id }).exec();
      if (existing) throw new ServerError(400, 'El usuario ya es miembro del espacio de trabajo');
    } else if (email) {
      const existingByEmail = await MemberWorkspace.findOne({ email: email, workspace: workspace_id }).exec();
      if (existingByEmail) throw new ServerError(400, 'Ya existe una invitación para ese correo electrónico');
    }

    const m = new MemberWorkspace({
      user: user_id,
      email,
      workspace: workspace_id,
      role,
      status
    });
    await m.save();
    return MemberWorkspace.findById(m._id).populate('user workspace').exec();
  }

  static async deleteById(member_id) {
    await MemberWorkspace.findByIdAndDelete(member_id).exec();
    return true;
  }

  static async updateRole(member_id, newRole) {
    const updated = await MemberWorkspace.findByIdAndUpdate(member_id, { role: newRole, modified_at: new Date() }, { new: true }).exec();
    return updated;
  }
}

export default MemberWorkspaceRepository;