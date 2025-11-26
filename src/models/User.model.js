import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verified_email: { type: Boolean, required: true, default: false },
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date, default: null },
  active: { type: Boolean, default: true },
  reset_token: { type: String, default: null },
  reset_token_expiry: { type: Date, default: null }
});

const Users = mongoose.model('User', userSchema);
export default Users;