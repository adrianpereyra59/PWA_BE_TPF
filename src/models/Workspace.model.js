import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url_image: { type: String, default: '' },
  modified_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
});

const Workspaces = mongoose.model('Workspace', workspaceSchema);
export default Workspaces;