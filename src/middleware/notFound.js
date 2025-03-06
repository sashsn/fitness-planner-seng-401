const { ApiError } = require('../utils/errors');

/**
 * Middleware to handle 404 Not Found errors
 * This middleware should be placed after all defined routes
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFound = (req, res, next) => {
  console.log(`Not found: ${req.originalUrl}`);
  const error = new ApiError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

module.exports = { notFound };
