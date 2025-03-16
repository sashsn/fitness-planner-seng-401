/**
 * User Service
 * Business logic for user-related operations
 */
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');
const config = require('../config/server');

/**
 * Create a new user
 * @param {Object} userData - User registration data
 * @returns {Object} User object and JWT token
 */
const createUser = async (userData) => {
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
    
    // No password hashing - store password directly
    // Create user with plain text password
    const user = await User.create(userData);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
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
const loginUser = async (email, password) => {
  try {
    // Use the new function that includes the password field
    const user = await getUserByEmailWithPassword(email);
    
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    // Check if password field exists
    if (!user.password) {
      logger.error(`User ${email} found but has no password field`);
      throw new ApiError(500, 'User account data is incomplete');
    }
    
    // Use bcrypt to compare passwords
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
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
const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    return user;
  } catch (error) {
    logger.error(`Error getting user by ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Object} User object or null
 */
const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ 
      where: { email },
      attributes: { exclude: ['password'] }
    });
  } catch (error) {
    logger.error(`Error getting user by email ${email}:`, error);
    throw error;
  }
};

/**
 * Get user by email with password (for authentication)
 * @param {string} email - User email
 * @returns {Object} User object with password or null
 */
const getUserByEmailWithPassword = async (email) => {
  try {
    return await User.findOne({ 
      where: { email }
      // Note: Not excluding password field
    });
  } catch (error) {
    logger.error(`Error getting user with password by email ${email}:`, error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} userData - User data to update
 * @returns {Object} Updated user
 */
const updateUserProfile = async (userId, userData) => {
  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    // Don't allow updating email or password through this function
    const { email, password, ...updateData } = userData;
    
    await user.update(updateData);
    
    // Return updated user without password
    const { password: _, ...updatedUser } = user.get({ plain: true });
    
    return updatedUser;
  } catch (error) {
    logger.error(`Error updating user profile for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Update user password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {boolean} Success status
 */
const updatePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    // Verify current password
    const isPasswordValid = await user.matchPassword(currentPassword);
    
    if (!isPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }
    
    // Update with new password
    user.password = newPassword;
    await user.save();
    
    return true;
  } catch (error) {
    logger.error(`Error updating password for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Delete user account
 * @param {string} userId - User ID
 * @returns {boolean} Success status
 */
const deleteUserAccount = async (userId) => {
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
 * Get user profile with expanded fitness data
 * @param {string} userId - User ID
 * @returns {Object} User profile with fitness data
 */
const getUserProfile = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { 
        exclude: ['password'] 
      }
    });
    
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    
    // Calculate additional fitness metrics
    const userData = user.get({ plain: true });
    
    // Calculate BMI if height and weight are present
    if (userData.height && userData.weight) {
      const heightInMeters = userData.height / 100; // Convert cm to m
      userData.bmi = +(userData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      
      // Determine BMI category
      if (userData.bmi < 18.5) userData.bmiCategory = 'Underweight';
      else if (userData.bmi < 25) userData.bmiCategory = 'Normal weight';
      else if (userData.bmi < 30) userData.bmiCategory = 'Overweight';
      else userData.bmiCategory = 'Obesity';
    }
    
    // Calculate age if date of birth is present
    if (userData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(userData.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      userData.age = age;
    }
    
    return userData;
  } catch (error) {
    logger.error(`Error getting user profile for user ${userId}:`, error);
    throw error;
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserById,
  getUserByEmail,
  getUserByEmailWithPassword, // Add this new function to exports
  updateUserProfile,
  updatePassword,
  deleteUserAccount,
  getUserProfile
};