/**
 * Error handling middleware
 */
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Not found error handler
 * Handles 404 errors for routes not found
 */
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not found - ${req.originalUrl}`);
  next(error);
};

/**
 * Global error handler
 * Handles all errors and sends appropriate response
 */
const errorHandler = (err, req, res, next) => {
  try {
    // Log the error
    logger.error(`Error: ${err.message || 'Unknown error'}`);
    
    // Get status code (ensure it's a number)
    const statusCode = typeof err.statusCode === 'number' 
      ? err.statusCode 
      : 500;
    
    // Ensure message is a string
    const message = typeof err.message === 'string' 
      ? err.message 
      : 'Internal Server Error';
      
    // Format the response
    const response = {
      success: false,
      message,
      errors: err.errors || [],
    };

    // Add stack trace in development
    if (process.env.NODE_ENV !== 'production') {
      response.stack = err.stack;
    }

    // Send the response
    res.status(statusCode).json(response);
  } catch (error) {
    console.error('Error in errorHandler middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error in error handler',
    });
  }
};

module.exports = {
  notFound,
  errorHandler
};
