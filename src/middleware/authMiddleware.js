/**
 * Authentication middleware
 */
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

/**
 * Middleware to protect routes
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Prioritize Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Ensure a token is provided
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    try {
      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      
      // Check if the token stores `id` instead of `userId`
      const userId = decoded.userId || decoded.id; 

      // Fetch user from the database
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] } // Hide password
      });

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: 'Account is deactivated. Please contact support.' });
      }

      // Attach user to the request object
      req.user = user;
      
      next();
    } catch (error) {
      logger.error(`JWT verification error: ${error.message}`);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return res.status(500).json({ message: 'Server error in authentication' });
  }
};

module.exports = { protect };
