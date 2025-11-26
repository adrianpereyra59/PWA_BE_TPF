import mongoose from 'mongoose';

const memberWorkspaceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  email: { type: String, default: null }, // fallback for invites
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  role: { type: String, enum: ['admin', 'member', 'viewer'], default: 'member' },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date, default: null }
});

const MemberWorkspace = mongoose.model('MemberWorkspace', memberWorkspaceSchema);
export default MemberWorkspace;