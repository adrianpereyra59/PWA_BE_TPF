import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/environment.config.js';
import UserRepository from '../repositories/user.repository.js';
import { sendMail } from '../config/mailer.config.js';

const SALT_ROUNDS = 10;

class AuthService {
  static async register(username, password, email) {
    const existing = await UserRepository.getByEmail(email);
    if (existing) throw { status: 400, message: 'Correo electrónico ya en uso' };

    const password_hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserRepository.createUser(username, email, password_hashed);

    const verification_token = jwt.sign({ email: email, user_id: user._id }, ENVIRONMENT.JWT_SECRET_KEY, { expiresIn: '7d' });

    const verifyUrl = `${ENVIRONMENT.URL_API_BACKEND || ''}/api/auth/verify-email/${verification_token}`;
    try {
      await sendMail({
        from: ENVIRONMENT.GMAIL_USERNAME || 'no-reply@example.com',
        to: email,
        subject: 'Verifica tu correo electrónico',
        html: `<p>Hola ${username || ''},</p>
               <p>Haz clic para verificar: <a href="${verifyUrl}">${verifyUrl}</a></p>`
      });
    } catch (err) {
      console.error('Error al enviar el correo de verificación:', err);
    }

    return user;
  }

  static async verifyEmail(verification_token) {
    try {
      const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET_KEY);
      await UserRepository.updateById(payload.user_id, { verified_email: true });
      return;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) throw { status: 400, message: 'Token inválido' };
      throw error;
    }
  }

  static async login(email, password) {
    const user = await UserRepository.getByEmail(email);
    if (!user) throw { status: 404, message: 'Correo electrónico no registrado' };
    if (!user.verified_email) throw { status: 401, message: 'Correo electrónico no verificado' };

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw { status: 401, message: 'Credenciales inválidas' };

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: 'user' }, ENVIRONMENT.JWT_SECRET_KEY, { expiresIn: '7d' });
    return { authorization_token: token, user };
  }
}

export default AuthService;