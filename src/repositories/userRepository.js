import User from '../models/User.js';

export async function findByEmail(email) {
  return User.findOne({ email: String(email).toLowerCase().trim() }).exec();
}

export async function findById(id) {
  return User.findById(id).exec();
}

export async function createUser(data) {
  const user = new User(data);
  return user.save();
}

export async function updateUser(id, updates) {
  return User.findByIdAndUpdate(id, updates, { new: true }).exec();
}