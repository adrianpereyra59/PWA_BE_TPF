import MessageService from '../services/message.service.js';

class MessageController {
  static async create(req, res) {
    try {
      const { channel_id } = req.params;
      const { content } = req.body;
      const member_id = req.member._id || req.member._id;
      const messages = await MessageService.create(content, member_id, channel_id);
      res.status(201).json({ ok: true, data: { messages } });
    } catch (err) {
      console.error('message.create error', err);
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }

  static async getAllByChannel(req, res) {
    try {
      const { channel_id } = req.params;
      const messages = await MessageService.getAllByChannelId(channel_id);
      res.status(200).json({ ok: true, data: { messages } });
    } catch (err) {
      console.error('message.getAll error', err);
      res.status(500).json({ ok: false, message: 'Internal server error' });
    }
  }
}

export default MessageController;