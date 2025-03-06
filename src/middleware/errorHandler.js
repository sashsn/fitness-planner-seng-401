/**
 * Error handling middleware
 */
const logger = require('../utils/logger');

/**
 * Not found error handler
 * Handles 404 errors for routes not found
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Global error handler
 * Handles all errors and sends appropriate response
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message || 'Unknown error'}`);
  
  // Get status code (ensure it's a number)
  const statusCode = typeof err.statusCode === 'number' 
    ? err.statusCode 
    : 500;
  
  // Send the response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = {
  notFound,
  errorHandler
};
