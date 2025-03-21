/**
 * User Service
 * Business logic for user-related operations
 */
const { User } = require('../models');
          const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');
const { sequelize } = require('../models'); 


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


const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('email')),
        email.toLowerCase()
      )
    });

    // Check if the user exists and if the account is active
    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid credentials or account deleted');
    }

    console.log("✅ User found:", user.email);

    // Check if the password matches
    const isPasswordValid = await user.matchPassword(password);
    
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }


    // Generate a token
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
        role: user.role
      },
      token
    };
  } catch (error) {
    console.error("🔥 Error in loginUser:", error);
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
const updateUser = async (userId, userData) => {
  try {
    console.log(`🔄 Attempting to update User ID: ${userId}`);

    // Fetch user
    const user = await User.findByPk(userId);
    if (!user) {
      console.error("❌ User not found for ID:", userId);
      throw new ApiError(404, 'User not found');
    }

    console.log("✅ User found:", user.email);

    // Log incoming update data
    console.log("📌 Updating with data:", userData);

    // Update user fields
    await user.update(userData);

    console.log("✅ User updated successfully");

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
    console.error(`🔥 Error updating user ${userId}:`, error);
    throw error;
  }
};


/**
 * Delete user by ID
 * @param {string} userId - User ID
 * @returns {boolean} Success status
 */
const deleteUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Instead of deleting, deactivate the user
    await user.update({ isActive: false });

    return true;
  } catch (error) {
    logger.error(`Error deactivating user ${userId}:`, error);
    throw error;
  }
};


/**
 * Verify user credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {boolean} Authentication result
 */
const verifyCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return false;
    }
    
    // Direct comparison without bcrypt
    return password === user.password;
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

// Use CommonJS module exports - consolidate all exports in one object
module.exports = {
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
  verifyCredentials,
  getUserByEmail,
  getUserByUsername
};