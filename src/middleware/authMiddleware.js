/**
 * Authentication middleware
 */
const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/errors');
const { User } = require('../models');
const logger = require('../utils/logger');

/**
 * Middleware to protect routes
 * Verifies the JWT token and adds the user to the request object
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token is in headers or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Get token from cookie
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return next(new ApiError(401, 'Not authorized, no token provided'));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

      // Add user to request object
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return next(new ApiError(401, 'Not authorized, user not found'));
      }

      next();
    } catch (error) {
      logger.error(`JWT verification error: ${error.message}`);
      return next(new ApiError(401, 'Not authorized, token failed'));
    }
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return next(new ApiError(500, 'Server error in authentication'));
  }
};

module.exports = {
  protect
};
