const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${statusCode} – ${err.message}`);
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status,
    message: err.message || 'An unexpected error occurred.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};


class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, AppError };