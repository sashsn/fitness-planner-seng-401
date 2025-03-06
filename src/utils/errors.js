const logger = require('./logger');

/**
 * Error utilities
 */

/**
 * Custom API error class that extends Error
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Log API errors with additional information
 * @param {Error} error - Error object
 * @param {Object} req - Express request object
 */
const logApiError = (error, req = {}) => {
  console.error('Error:', error.message || error);
  console.log('DEBUG: Request path:', req.path);
  console.log('DEBUG: Request method:', req.method);
  console.log('DEBUG: Stack trace:', error.stack);
};

module.exports = {
  ApiError,
  logApiError
};
