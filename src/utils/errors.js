const logger = require('./logger');

/**
 * Error utilities
 */

/**
 * Custom error classes for the application
 */

/**
 * API Error - used for API-related errors
 */
class ApiError extends Error {
  /**
   * Create an API error
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Authentication Error - used for auth-related errors
 */
class AuthError extends ApiError {
  /**
   * Create an authentication error
   * @param {string} message - Error message
   */
  constructor(message = 'Unauthorized') {
    super(401, message);
    this.name = 'AuthError';
  }
}

/**
 * Validation Error - used for validation errors
 */
class ValidationError extends ApiError {
  /**
   * Create a validation error
   * @param {string} message - Error message
   * @param {Object} errors - Validation errors
   */
  constructor(message = 'Validation failed', errors = {}) {
    super(400, message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Not Found Error - used for resource not found errors
 */
class NotFoundError extends ApiError {
  /**
   * Create a not found error
   * @param {string} message - Error message
   */
  constructor(message = 'Resource not found') {
    super(404, message);
    this.name = 'NotFoundError';
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
  AuthError,
  ValidationError,
  NotFoundError,
  logApiError
};
