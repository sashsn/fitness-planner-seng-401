/**
 * Authentication Middleware
 * Validates session and adds user to request
 */
const { User } = require('../models');
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

/**
 * Authenticate user by JWT token or session
 */
exports.auth = async (req, res, next) => {
  try {
    // Check for JWT token in the Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Check if user exists
        const user = await User.findByPk(decoded.id);
        if (!user) {
          throw new ApiError(401, 'Invalid token - user not found');
        }
        
        // Add user info to request
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role
        };
        
        return next();
      } catch (jwtError) {
        logger.error('JWT verification failed:', jwtError);
        throw new ApiError(401, 'Invalid or expired token');
      }
    }
    
    // Fall back to session-based authentication
    if (req.session.userId) {
      const user = await User.findByPk(req.session.userId);
      if (!user) {
        // Clear invalid session
        req.session.destroy();
        throw new ApiError(401, 'User not found');
      }
      
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role
      };
      
      return next();
    }
    
    throw new ApiError(401, 'Authentication required');
  } catch (error) {
    logger.error('Authentication error:', error);
    next(error);
  }
};

// Admin authentication middleware remains unchanged
exports.adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new ApiError(403, 'Access denied - Admin only'));
};
