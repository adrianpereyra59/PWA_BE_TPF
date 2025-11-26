import ChannelMessage from '../models/ChannelMessage.model.js';

class ChannelMessageRepository {
  static async create(content, channel_id, member_id) {
    const msg = new ChannelMessage({ content, channel: channel_id, member: member_id });
    await msg.save();
    return msg._id;
  }

  static async getAllByChannelId(channel_id) {
    return ChannelMessage.find({ channel: channel_id }).sort({ created_at: 1 }).populate({
      path: 'member',
      populate: { path: 'user', select: 'name email' }
    }).exec();
  }
}

export default ChannelMessageRepository;