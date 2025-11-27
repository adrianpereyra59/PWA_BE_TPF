import WorkspacesRepository from '../repositories/workspace.repository.js';
import MemberWorkspaceRepository from '../repositories/memberWorkspace.repository.js';
import UserRepository from '../repositories/user.repository.js';
import { sendMail } from '../config/mailer.config.js';
import ENVIRONMENT from '../config/environment.config.js';
import jwt from 'jsonwebtoken';

export async function createWorkspaceForUser(ownerId, { name, url_image }) {
  const ws = await WorkspacesRepository.createWorkspace(name, url_image);
  await MemberWorkspaceRepository.create({ user_id: ownerId, workspace_id: ws._id, role: 'admin', status: 'accepted' });
  return ws;
}

export async function listWorkspaces(userId) {
  return MemberWorkspaceRepository.getAllByUserId(userId);
}

export async function getWorkspace(id) {
  return WorkspacesRepository.getById(id);
}

export async function inviteMember(requestingMember, workspace, invitedEmail) {
  const user = await UserRepository.getByEmail(invitedEmail);
  if (!user) throw { status: 404, message: 'Usuario no registrado' };

  const existing = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(user._id, workspace._id);
  if (existing) throw { status: 409, message: 'El usuario ya es miembro' };

  const inviteToken = jwt.sign({
    id_invited: user._id,
    email_invited: invitedEmail,
    id_workspace: workspace._id,
    id_inviter: requestingMember._id
  }, ENVIRONMENT.JWT_SECRET_KEY, { expiresIn: '7d' });

  const acceptUrl = `${ENVIRONMENT.URL_API_BACKEND}/api/members/confirm-invitation/${inviteToken}`;
  await sendMail({
    from: ENVIRONMENT.GMAIL_USERNAME || 'no-reply@example.com',
    to: invitedEmail,
    subject: 'Invitación al workspace',
    html: `<p>Has sido invitado al workspace ${workspace.name}.</p><p><a href="${acceptUrl}">Aceptar invitación</a></p>`
  });

  return { ok: true };
}