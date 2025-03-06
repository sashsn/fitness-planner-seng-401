/**
 * User Service
 * Business logic for user-related operations
 */
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Create a new user
 * @param {Object} userData - User registration data
 * @returns {Object} User object and JWT token
 */
exports.createUser = async (userData) => {
  try {
    // Check if user with email already exists
    const existingUserByEmail = await User.findOne({ where: { email: userData.email } });
    if (existingUserByEmail) {
      throw new ApiError(409, 'Email already in use');
    }
    
    // Check if username already exists
    const existingUserByUsername = await User.findOne({ where: { username: userData.username } });
    if (existingUserByUsername) {
      throw new ApiError(409, 'Username already taken');
    }
    
    // Hash password before creating user
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    // Create user
    const user = await User.create(userData);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );
    
    // Return user without password
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      height: user.height,
      weight: user.weight,
      role: user.role
    };
    
    return { user: userResponse, token };
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} User object and JWT token
 */
exports.loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Fix: Use numeric status code as first parameter
      throw new ApiError(401, 'Invalid credentials');
    }
    
    // Use bcrypt to compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Fix: Use numeric status code as first parameter
      throw new ApiError(401, 'Invalid credentials');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );
    
    return { 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        height: user.height,
        weight: user.weight,
        role: user.role
      },
      token
    };
  } catch (error) {
    logger.error('Error during login:', error);
    throw error;
  }
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object} User object
 */
exports.getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      height: user.height,
      weight: user.weight,
      role: user.role,
      isActive: user.isActive
    };
  } catch (error) {
    logger.error('Error getting user:', error);
    throw error;
  }
};

/**
 * Update user by ID
 * @param {string} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Object} Updated user object
 */
exports.updateUser = async (userId, userData) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    // Hash password if it's being updated
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    await user.update(userData);
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      height: user.height,
      weight: user.weight,
      role: user.role
    };
  } catch (error) {
    logger.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

/**
 * Delete user by ID
 * @param {string} userId - User ID
 * @returns {boolean} Success status
 */
exports.deleteUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    await user.destroy();
    return true;
  } catch (error) {
    logger.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

/**
 * Verify user credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {boolean} Authentication result
 */
exports.verifyCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return false;
    }
    
    return bcrypt.compare(password, user.password);
  } catch (error) {
    logger.error('Error verifying credentials:', error);
    return false;
  }
};

const getUserByEmail = async (email) => {
  try {
    logger.debug(`Searching for user with email: ${email}`);
    
    const user = await User.findOne({
      where: { email },
      attributes: { include: ['password'] } // Explicitly include password
    });
    
    if (user) {
      logger.debug(`Found user with email ${email}: ID=${user.id}, username=${user.username}`);
    } else {
      logger.debug(`No user found with email: ${email}`);
    }
    
    return user;
  } catch (error) {
    logger.error(`Error finding user by email ${email}: ${error.message}`);
    throw error;
  }
};

const getUserByUsername = async (username) => {
  return await User.findOne({ where: { username } });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

// Fix the module exports to include all required functions
module.exports = {
  createUser: exports.createUser,
  loginUser: exports.loginUser,
  getUserById: exports.getUserById,
  updateUser: exports.updateUser,
  deleteUser: exports.deleteUser,
  verifyCredentials: exports.verifyCredentials,
  getUserByEmail,
  getUserByUsername
};