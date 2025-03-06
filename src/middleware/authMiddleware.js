const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/errors');
const db = require('../models');
const logger = require('../utils/logger');

// Protect routes middleware
const protect = async (req, res, next) => {
  let token;

  try {
    logger.debug('Checking authorization');
    
    // Check if token exists in headers or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      logger.debug('Found token in Authorization header');
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      logger.debug('Found token in cookies');
    }

    if (!token) {
      logger.warn('No token found in request');
      return next(new ApiError('Not authorized, no token', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      logger.debug('Token verified successfully');

      // Get user from token
      const user = await db.User.findByPk(decoded.id);

      if (!user) {
        logger.warn(`User not found for token ID: ${decoded.id}`);
        return next(new ApiError('User not found', 404));
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      logger.error(`Token verification failed: ${error.message}`);
      return next(new ApiError('Not authorized, token failed', 401));
    }
  } catch (error) {
    logger.error(`Error in auth middleware: ${error.message}`);
    return next(new ApiError('Authorization error', 500));
  }
};

module.exports = { protect };
