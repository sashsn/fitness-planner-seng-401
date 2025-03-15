/**
 * Authentication Middleware
 * Verifies JWT tokens for protected routes
 */
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AuthError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Authenticate requests using JWT
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      throw new AuthError('No token provided, authorization denied');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      throw new AuthError('User not found');
    }
    
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      logger.warn(`Invalid token: ${error.message}`);
      next(new AuthError('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      logger.warn(`Token expired: ${error.message}`);
      next(new AuthError('Token expired, please log in again'));
    } else {
      logger.error(`Auth middleware error: ${error.message}`);
      next(error);
    }
  }
};

/**
 * Check if the user is an admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    next(new AuthError('Not authorized as admin'));
  }
};
