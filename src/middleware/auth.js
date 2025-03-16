/**
 * Authentication Middleware
 * Verifies JWT tokens for protected routes
 */
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AuthError } = require('../utils/errors');
const logger = require('../utils/logger');
const config = require('../config/server'); // Import server config

// Get JWT secret from the same config used everywhere
const JWT_SECRET = config.jwtSecret;

/**
 * Authenticate requests using JWT
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.auth = async (req, res, next) => {
  try {
    // Enable DEV_SKIP_AUTH in development mode to bypass auth
    if (process.env.NODE_ENV === 'development' && process.env.DEV_SKIP_AUTH === 'true') {
      logger.warn('⚠️ Authentication bypassed in development mode');
      
      // Create a consistent test user ID for development
      const testUserId = 'dev-user-' + (Math.floor(Date.now() / 3600000) % 24); // Changes once per hour
      
      req.user = { 
        id: testUserId,
        username: 'dev-user',
        email: 'dev@example.com',
        isAdmin: true
      };
      return next();
    }

    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      throw new AuthError('No token provided, authorization denied');
    }

    // Verify token with the same JWT_SECRET used to create it
    logger.debug(`Verifying token with secret prefix: ${JWT_SECRET.substring(0, 3)}...`);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find the user
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      throw new AuthError('User not found');
    }
    
    // Add user to request
    req.user = user;
    
    // Add a timestamp to track when this request was authenticated
    req.authTimestamp = Date.now();
    
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
 * Optional authentication - doesn't fail if token is missing,
 * but validates and attaches user if token is present
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without authentication
      req.user = null;
      return next();
    }
    
    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find the user
    const user = await User.findByPk(decoded.id);
    
    // Add user to request if found
    req.user = user || null;
    
    next();
  } catch (error) {
    // Don't fail if token is invalid, just continue without authentication
    req.user = null;
    next();
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
