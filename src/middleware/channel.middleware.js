import ChannelRepository from '../repositories/channel.repository.js';
import { ServerError } from '../utils/customError.utils.js';

async function channelMiddleware(req, res, next) {
  try {
    const { channel_id, workspace_id } = req.params;
    const channel_selected = await ChannelRepository.getByIdAndWorkspaceId(channel_id, workspace_id);
    if (!channel_selected) throw new ServerError(404, 'canal no encontrado en el workspace');
    req.channel_selected = channel_selected;
    next();
  } catch (error) {
    console.log('channel.middleware error', error);
    if (error.status) {
      return res.status(error.status).json({ ok: false, status: error.status, message: error.message });
    }
    return res.status(500).json({ ok: false, status: 500, message: 'Error interno del servidor al listar canales' });
  }
}

export default channelMiddleware;