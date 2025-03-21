/**
 * User Controller
 * Handles user-related HTTP requests
 */
const userService = require('../services/userService');
const logger = require('../utils/logger');
const { ApiError } = require('../utils/errors');


/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const userData = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      user: userData.user,
      token: userData.token
    });
  } catch (error) {
    logger.error(' Error in register:', error);
    next(error);
  }
};


/**
 * Login User
 */
const login = async (req, res, next) => {
  try {
    console.log(`🔄 Login attempt for: ${req.body.email}`);

    const userData = await userService.loginUser(req.body.email, req.body.password);
    
    res.status(200).json({
      success: true,
      user: userData.user,
      token: userData.token
    });
  } catch (error) {
    console.error(" Login error:", error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Login failed' });
  }
};

/**
 * Get user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userData = req.body;
    const updatedUser = await userService.updateUser(userId, userData);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user account
 */

const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user with isActive set to false
    user.isActive = false;
    await user.save(); // Save the updated user instance
    await user.reload(); 

    res.clearCookie("token");
    res.status(200).json({ message: "Account deactivated successfully" });

  } catch (error) {
    console.error(" Error in deleteAccount method:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



/**
 * Logout user
 */
const logout = (req, res) => {
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

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
  logout
};
