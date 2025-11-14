import {
  createWorkspace,
  listWorkspacesForUser,
  getWorkspaceById,
  deleteWorkspace,
  addUserToWorkspace,
  removeUserFromWorkspace,
  updateUserRoleInWorkspace
} from '../repositories/workspaceRepository.js';

import { findByEmail, createUser } from '../repositories/userRepository.js';
import { sendMail } from '../utils/mailer.js';

export async function createWorkspaceForUser(ownerId, payload) {
  const ws = await createWorkspace({ ...payload, owner: ownerId, users: [] });
  return ws;
}

export async function listWorkspaces(userId) {
  return listWorkspacesForUser(userId);
}

export async function getWorkspace(id) {
  return getWorkspaceById(id);
}

export async function removeWorkspace(id, requestingUserId) {
  // Optionally check owner
  const ws = await getWorkspaceById(id);
  if (!ws) throw { status: 404, message: 'Workspace not found' };
  if (String(ws.owner._id) !== String(requestingUserId)) {
    throw { status: 403, message: 'Only owner can delete workspace' };
  }
  return deleteWorkspace(id);
}

export async function inviteOrAddUser(workspaceId, { email, role }) {
  let user = await findByEmail(email);
  if (!user) {
    const randomPassword = Math.random().toString(36).slice(2, 10);
    user = await createUser({
      name: '',
      email,
      passwordHash: await import('bcryptjs').then(m => m.hash(randomPassword, 10)),
      verified: false
    });
    const acceptUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/register`;
    sendMail({
      to: email,
      subject: 'Invitación a workspace',
      html: `<p>Fuiste invitado al workspace. Regístrate en: <a href="${acceptUrl}">${acceptUrl}</a></p>`
    }).catch(console.error);
  }

  const entry = {
    user: user._id,
    email,
    role: role || 'member'
  };

  const ws = await addUserToWorkspace(workspaceId, entry);
  return ws;
}

export async function removeUser(workspaceId, userId) {
  return removeUserFromWorkspace(workspaceId, userId);
}

export async function changeUserRole(workspaceId, userId, role) {
  return updateUserRoleInWorkspace(workspaceId, userId, role);
}