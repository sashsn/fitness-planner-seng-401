/**
 * Error handling middleware
 */
const logger = require('../utils/logger');
const { ApiError } = require('../utils/errors');

/**
 * Handle 404 errors
 */
exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global error handler
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.errorHandler = (err, req, res, next) => {
  // Determine status code (default to 500 if not specified)
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log error
  if (statusCode >= 500) {
    logger.error(`Internal Error: ${err.message}\n${err.stack}`);
  } else {
    logger.warn(`Client Error: ${err.message}`);
  }
  
  // Format the error response
  const errorResponse = {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  };
  
  // Add validation errors if available (for Sequelize/Joi validation)
  if (err.errors) {
    errorResponse.errors = err.errors;
  }
  
  // Set status and send response
  res.status(statusCode).json(errorResponse);
};

/**
 * Async handler for Express routes
 * Eliminates the need for try/catch blocks in route handlers
 * @param {Function} fn - Async route handler
 * @returns {Function} Wrapped route handler
 */
exports.asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
