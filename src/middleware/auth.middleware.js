import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/environment.config.js';
import { ServerError } from '../utils/customError.utils.js';

const authMiddleware = (req, res, next) => {
  try {
    const authorization_header = req.headers.authorization;
    if (!authorization_header) throw new ServerError(400, 'Sin encabezado de autorización');
    const token = authorization_header.split(' ').pop();
    if (!token) throw new ServerError(400, 'No se proporcionó token');

    const payload = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY);
    req.user = payload;
    next();
  } catch (error) {
    console.log('auth.middleware error', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ ok: false, status: 401, message: 'Token inválido' });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ ok: false, status: 401, message: 'Token expirado' });
    } else if (error.status) {
      return res.status(error.status).json({ ok: false, status: error.status, message: error.message });
    } else {
      return res.status(500).json({ ok: false, status: 500, message: 'Error interno del servidor' });
    }
  }
};

export default authMiddleware;

export const authByRoleMiddleware = (valid_roles = []) => {
  return (req, res, next) => {
    try {
      const authorization_header = req.headers.authorization;
      if (!authorization_header) throw new ServerError(400, 'Sin encabezado de autorización');
      const token = authorization_header.split(' ').pop();
      if (!token) throw new ServerError(400, 'No se proporcionó token');

      const payload = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY);
      if (valid_roles.length > 0 && !valid_roles.includes(payload.role)) {
        throw new ServerError(403, 'No permitido');
      }
      req.user = payload;
      next();
    } catch (error) {
      console.log('authByRole error', error);
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ ok: false, status: 401, message: 'Token inválido' });
      } else if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ ok: false, status: 401, message: 'Token expirado' });
      } else if (error.status) {
        return res.status(error.status).json({ ok: false, status: error.status, message: error.message });
      } else {
        return res.status(500).json({ ok: false, status: 500, message: 'Error interno del servidor' });
      }
    }
  };
};