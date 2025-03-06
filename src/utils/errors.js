const logger = require('./logger');

/**
 * Custom API Error class for handling API-specific errors
 */
class ApiError extends Error {
  constructor(message, statusCode = 400, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(message, 400, errors);
  }

  static unauthorized(message = 'Unauthorized', errors = []) {
    return new ApiError(message, 401, errors);
  }

  static forbidden(message = 'Forbidden', errors = []) {
    return new ApiError(message, 403, errors);
  }

  static notFound(message = 'Not Found', errors = []) {
    return new ApiError(message, 404, errors);
  }

  static conflict(message = 'Conflict', errors = []) {
    return new ApiError(message, 409, errors);
  }

  static internal(message = 'Internal Server Error', errors = []) {
    return new ApiError(message, 500, errors);
  }
}

/**
 * Logs API errors with detailed information
 * @param {Error} error - Error object to log
 * @param {Request} req - Express request object (optional)
 */
const logApiError = (error, req = null) => {
  const errorData = {
    message: error.message,
    path: req?.path,
    method: req?.method,
    statusCode: error.statusCode,
    stack: error.stack
  };
  
  logger.error(JSON.stringify(errorData));
};

module.exports = {
  ApiError,
  logApiError
};
