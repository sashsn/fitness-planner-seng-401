/**
 * Global error handling middleware
 * This middleware should be used as the last middleware in your Express app
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const logger = require('../utils/logger');
const { ApiError } = require('../utils/errors');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log detailed error information
  console.error('Error encountered:', err);
  logger.error(`Error: ${err.message}`);
  if (req && req.path) {
    logger.debug(`Request path: ${req.path}`);
    logger.debug(`Request method: ${req.method}`);
  }
  
  if (err.stack) {
    logger.debug(`Stack trace: ${err.stack}`);
  }

  // Use error properties or defaults
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

module.exports = errorHandler;
