import Workspace from '../models/Workspace.js';
import mongoose from 'mongoose';

export async function createWorkspace(payload) {
  const ws = new Workspace(payload);
  return ws.save();
}

export async function listWorkspacesForUser(userId) {
  return Workspace.find({
    $or: [
      { owner: userId },
      { 'users.user': mongoose.Types.ObjectId(userId) },
      { 'users.email': { $exists: true } } // optional: include invited
    ]
  }).populate('owner', 'name email').populate('users.user', 'name email').exec();
}

export async function getWorkspaceById(id) {
  return Workspace.findById(id).populate('owner', 'name email').populate('users.user', 'name email').exec();
}

export async function deleteWorkspace(id) {
  return Workspace.findByIdAndDelete(id).exec();
}

export async function addUserToWorkspace(workspaceId, userEntry) {
  return Workspace.findByIdAndUpdate(workspaceId, { $push: { users: userEntry } }, { new: true })
    .populate('owner', 'name email')
    .populate('users.user', 'name email')
    .exec();
}

export async function removeUserFromWorkspace(workspaceId, userId) {
  return Workspace.findByIdAndUpdate(workspaceId, { $pull: { users: { user: userId } } }, { new: true })
    .populate('owner', 'name email')
    .populate('users.user', 'name email')
    .exec();
}

export async function updateUserRoleInWorkspace(workspaceId, userId, role) {
  const ws = await Workspace.findById(workspaceId);
  if (!ws) throw new Error('Workspace not found');
  const u = ws.users.find(u => String(u.user) === String(userId));
  if (u) u.role = role;
  await ws.save();
  return Workspace.findById(workspaceId).populate('owner', 'name email').populate('users.user', 'name email').exec();
}