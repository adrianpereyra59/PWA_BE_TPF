import ChannelRepository from '../repositories/channel.repository.js';

class ChannelController {
  static async create(req, res) {
    try {
      const { name } = req.body;
      const { workspace_id } = req.params;
      if (!name) return res.status(400).json({ ok: false, message: 'nombre requerido' });

      const existing = await ChannelRepository.getAllByWorkspaceAndName(workspace_id, name);
      if (existing.length > 0) return res.status(409).json({ ok: false, message: 'El canal ya existe' });

      await ChannelRepository.create(name, false, workspace_id);
      const updated = await ChannelRepository.getAllByWorkspace(workspace_id);
      res.status(201).json({ ok: true, data: { channels: updated }, message: 'Canal creado' });
    } catch (err) {
      console.error('channel.create error', err);
      res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  }

  static async getAllByWorkspace(req, res) {
    try {
      const { workspace_id } = req.params;
      const channels = await ChannelRepository.getAllByWorkspace(workspace_id);
      res.json({ ok: true, data: { channels } });
    } catch (err) {
      console.error('channel.getAllByWorkspace error', err);
      res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
  }
}

export default ChannelController;