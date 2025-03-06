const { ApiError, logApiError } = require('../utils/errors');

// Not found middleware
const notFound = (req, res, next) => {
  const error = ApiError.notFound(`Not Found - ${req.originalUrl}`);
  logApiError(error, req);
  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log detailed error information
  logApiError(err, req);
  
  // Use ApiError properties or defaults
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];
  
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = {
  notFound,
  errorHandler
};
