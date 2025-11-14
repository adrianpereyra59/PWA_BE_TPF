import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET_KEY || 'CHANGE_ME';

export function signActivationToken(payload, expiresIn = '1d') {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

export function signAuthToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, SECRET, { expiresIn });
}