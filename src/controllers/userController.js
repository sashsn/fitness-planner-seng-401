/**
 * User Controller
 * Handles user-related HTTP requests
 */
const userService = require('../services/userService');
const logger = require('../utils/logger');
const { ApiError } = require('../utils/errors');

/**
 * Register a new user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
exports.register = async (req, res, next) => {
  try {
    logger.info('Registration attempt received');
    const userData = req.body;
    
    // Log if the request body is empty or potentially malformed
    if (!userData || Object.keys(userData).length === 0) {
      logger.error('Registration failed: Empty or malformed request body');
      return res.status(400).json({
        success: false,
        message: 'Invalid request data'
      });
    }
    
    const result = await userService.createUser(userData);
    
    logger.info('User registered successfully');
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    logger.error('Registration failed:', error.message);
    
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
    }
    
    // Handle Sequelize unique constraint errors specifically
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0]?.path || 'field';
      return res.status(409).json({
        success: false,
        message: `${field} is already in use`,
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    next(error);
  }
};

/**
 * Login user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    
    // Check if session is available before accessing it
    if (req.session) {
      // Set user ID in session
      req.session.userId = result.user.id;
      logger.debug(`Session created for user ${result.user.id}`);
    } else {
      logger.warn('Session object not available during login');
    }
    
    logger.info(`User logged in: ${email}`);
    
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Login failed: ${error.message}`);
    next(error);
  }
};

/**
 * Logout user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error('Error destroying session:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Logout failed'
      });
    }
    
    res.clearCookie('connect.sid');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  });
};

/**
 * Get user profile
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userProfile = await userService.getUserProfile(userId);
    
    res.status(200).json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    logger.error(`Error getting user profile: ${error.message}`);
    next(error);
  }
};

/**
 * Update user profile
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userData = req.body;
    
    const updatedUser = await userService.updateUserProfile(userId, userData);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    logger.error(`Error updating user profile: ${error.message}`);
    next(error);
  }
};

/**
 * Change user password
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }
    
    await userService.updatePassword(userId, currentPassword, newPassword);
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error(`Error changing password: ${error.message}`);
    next(error);
  }
};

/**
 * Delete user account
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    await userService.deleteUserAccount(userId);
    
    // Clear session after deleting account
    req.session.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting account: ${error.message}`);
    next(error);
  }
};

/**
 * Get current user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    logger.error(`Error getting current user: ${error.message}`);
    next(error);
  }
};
