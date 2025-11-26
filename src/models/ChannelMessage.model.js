import mongoose from 'mongoose';

const channelMessageSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'MemberWorkspace', required: true },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const ChannelMessage = mongoose.model('ChannelMessage', channelMessageSchema);
export default ChannelMessage;