import Users from "../models/User.model.js";

class UserRepository {
  static async createUser(name, email, password) {
    const user = new Users({ name, email, password });
    return user.save();
  }

  static async getAll() {
    return Users.find().exec();
  }

  static async getById(user_id) {
    return Users.findById(user_id).exec();
  }

  static async deleteById(user_id) {
    return Users.findByIdAndDelete(user_id).exec();
  }

  static async updateById(user_id, new_values) {
    return Users.findByIdAndUpdate(user_id, new_values, { new: true }).exec();
  }

  static async getByEmail(email) {
    return Users.findOne({ email: String(email).toLowerCase().trim(), active: true }).exec();
  }

  static async getByResetToken(token) {
    if (!token) return null;
    return Users.findOne({ reset_token: token }).exec();
  }
}

export default UserRepository;