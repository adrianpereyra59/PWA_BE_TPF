import { verifyToken } from '../utils/jwt.js';
import { findById } from '../repositories/userRepository.js';

export default async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, message: 'No token provided' });
    }
    const token = auth.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload || !payload.id) return res.status(401).json({ ok: false, message: 'Invalid token' });

    const user = await findById(payload.id);
    if (!user) return res.status(401).json({ ok: false, message: 'User not found' });

    req.user = { id: user._id, email: user.email, name: user.name, role: user.role };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ ok: false, message: 'Unauthorized', details: err.message });
  }
}