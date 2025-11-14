import bcrypt from 'bcryptjs';
import { signActivationToken, signAuthToken, verifyToken } from '../utils/jwt.js';
import { createUser, findByEmail, updateUser, findById } from '../repositories/userRepository.js';
import { sendMail } from '../utils/mailer.js';
import crypto from 'crypto';

const SALT_ROUNDS = 10;

export async function registerUser({ name, email, password }) {
  const existing = await findByEmail(email);
  if (existing) throw { status: 400, message: 'Email already registered' };

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({ name, email, passwordHash, verified: false });

  const token = signActivationToken({ id: user._id }, '2d');

  const verifyUrl = `${process.env.URL_API_BACKEND || ''}/api/auth/verify?token=${token}`;
  await sendMail({
    to: user.email,
    subject: 'Verify your account',
    html: `<p>Hola ${user.name || ''},</p>
      <p>Haz click para verificar tu cuenta: <a href="${verifyUrl}">Verificar cuenta</a></p>
      <p>Si ese enlace no funciona, copia y pega en tu navegador:</p>
      <pre>${verifyUrl}</pre>`
  });

  return user;
}

export async function verifyAccount(token) {
  const data = verifyToken(token);
  const user = await findById(data.id);
  if (!user) throw { status: 404, message: 'User not found' };
  if (user.verified) return user;
  const updated = await updateUser(user._id, { verified: true });
  return updated;
}

export async function loginUser({ email, password }) {
  const user = await findByEmail(email);
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  if (!user.verified) throw { status: 401, message: 'Account not verified' };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw { status: 401, message: 'Invalid credentials' };

  const token = signAuthToken({ id: user._id, email: user.email, name: user.name }, '1h');
  return { token, user };
}

export async function requestPasswordReset(email) {
  const user = await findByEmail(email);
  if (!user) {
    return;
  }
  const resetToken = signActivationToken({ id: user._id }, '1h');

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  await sendMail({
    to: user.email,
    subject: 'Reset your password',
    html: `<p>Para restablecer tu contraseña haz click aquí: <a href="${resetUrl}">Restablecer contraseña</a></p>
      <p>Si no solicitaste esto, ignora este correo.</p>`
  });
  return;
}

export async function resetPassword(resetToken, newPassword) {
  const payload = verifyToken(resetToken);
  const user = await findById(payload.id);
  if (!user) throw { status: 404, message: 'User not found' };
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const updated = await updateUser(user._id, { passwordHash });
  return updated;
}