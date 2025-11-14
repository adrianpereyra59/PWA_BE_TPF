import {
  createWorkspaceForUser,
  listWorkspaces,
  getWorkspace,
  removeWorkspace,
  inviteOrAddUser,
  removeUser,
  changeUserRole
} from '../services/workspaceService.js';

export async function list(req, res, next) {
  try {
    const ws = await listWorkspaces(req.user.id);
    res.json({ ok: true, message: 'Workspaces fetched', data: { workspaces: ws } });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { name, description, url_img } = req.body;
    const created = await createWorkspaceForUser(req.user.id, { name, description, url_img });
    res.status(201).json({ ok: true, message: 'Workspace created', data: { workspace: created } });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const id = req.params.id;
    const ws = await getWorkspace(id);
    if (!ws) return res.status(404).json({ ok: false, message: 'Workspace not found' });
    res.json({ ok: true, message: 'Workspace', data: { workspace: ws } });
  } catch (err) {
    next(err);
  }
}

export async function del(req, res, next) {
  try {
    const id = req.params.id;
    await removeWorkspace(id, req.user.id);
    res.json({ ok: true, message: 'Workspace deleted' });
  } catch (err) {
    next(err);
  }
}

export async function addUser(req, res, next) {
  try {
    const workspaceId = req.params.id;
    const { email, role } = req.body;
    const ws = await inviteOrAddUser(workspaceId, { email, role });
    res.json({ ok: true, message: 'User added/invited', data: { workspace: ws } });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const { id: workspaceId, userId } = req.params;
    await removeUser(workspaceId, userId);
    res.json({ ok: true, message: 'User removed' });
  } catch (err) {
    next(err);
  }
}

export async function updateRole(req, res, next) {
  try {
    const { id: workspaceId, userId } = req.params;
    const { role } = req.body;
    const ws = await changeUserRole(workspaceId, userId, role);
    res.json({ ok: true, message: 'Role updated', data: { workspace: ws } });
  } catch (err) {
    next(err);
  }
}