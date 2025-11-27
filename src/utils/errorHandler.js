export default function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({
    ok: false,
    message: err.message || 'Error interno del servidor',
    details: err.details || null,
  });
}