import { validationResult } from 'express-validator';

export default function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ ok: false, message: 'fallo la validación', errors: errors.array() });
  }
  next();
}