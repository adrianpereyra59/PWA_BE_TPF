import {
  registerUser,
  verifyAccount,
  loginUser,
  requestPasswordReset,
  resetPassword
} from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser({ name, email, password });
    res.status(201).json({ ok: true, message: 'User created', data: { userId: user._id } });
  } catch (err) {
    next(err);
  }
}

export async function verify(req, res, next) {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).json({ ok: false, message: 'Token required' });
    const user = await verifyAccount(token);
    res.json({ ok: true, message: 'Account verified', data: { userId: user._id } });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser({ email, password });
    res.json({ ok: true, message: 'Logged in', data: { authorization_token: token, user: { id: user._id, email: user.email, name: user.name } } });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    await requestPasswordReset(email);
    res.json({ ok: true, message: 'If account exists, password reset instructions were sent' });
  } catch (err) {
    next(err);
  }
}

export async function resetPass(req, res, next) {
  try {
    const { reset_token, new_password } = req.body;
    if (!reset_token || !new_password) return res.status(400).json({ ok: false, message: 'reset_token and new_password required' });
    await resetPassword(reset_token, new_password);
    res.json({ ok: true, message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}