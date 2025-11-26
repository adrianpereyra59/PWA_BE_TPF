import Channels from '../models/Channel.model.js';

class ChannelRepository {
  static async create(name, isPrivate, workspace_id) {
    const ch = new Channels({ name, private: isPrivate, workspace: workspace_id });
    await ch.save();
    return ch;
  }

  static async getAllByWorkspace(workspace_id) {
    return Channels.find({ workspace: workspace_id, active: true }).exec();
  }

  static async getAllByWorkspaceAndName(workspace_id, name) {
    return Channels.find({ workspace: workspace_id, name }).exec();
  }

  static async getById(channel_id) {
    return Channels.findById(channel_id).exec();
  }

  static async getByIdAndWorkspaceId(channel_id, workspace_id) {
    return Channels.findOne({ _id: channel_id, workspace: workspace_id }).exec();
  }
}

export default ChannelRepository;