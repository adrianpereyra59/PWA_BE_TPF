import mongoose from 'mongoose';

const WorkspaceUserSubschema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String }, // fallback if invited but not registered
  role: { type: String, enum: ['admin','member','viewer'], default: 'member' },
}, { _id: false });

const WorkspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  url_img: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  users: { type: [WorkspaceUserSubschema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Workspace', WorkspaceSchema);