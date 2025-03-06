const userService = require('../services/UserService');
const User = require('../models').User;
const { ApiError, logApiError } = require('../utils/errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const db = require('../models'); // Add this import to fix db not defined error

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d'
  });
};

// Register a new user
const register = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName, dateOfBirth } = req.body;
    
    // Log registration attempt (without sensitive info)
    logger.debug(`Registration attempt for email: ${email}, username: ${username}`);
    
    // Validate input
    if (!username || !email || !password) {
      logger.warn('Registration missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    try {
      // Check if user already exists
      const existingUser = await userService.getUserByEmail(email);
      if (existingUser) {
        logger.warn(`Registration failed: email ${email} already exists`);
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // Create user without password hashing
      const user = await User.create({
        username,
        email,
        password,
        firstName: firstName || '',
        lastName: lastName || '',
        dateOfBirth: dateOfBirth || null,
        role: 'user'
      });

      // Generate token
      const token = generateToken(user.id);
      
      // Set token in cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
      });

      logger.info(`User registered successfully: ${email}`);
      return res.status(201).json({ 
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token
      });
    } catch (error) {
      logger.error(`Error during registration: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Registration failed'
      });
    }
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Log the attempt (without sensitive info)
    logger.debug(`Login attempt for email: ${email}`);
    
    if (!email || !password) {
      logger.warn('Login attempt missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // First try to find the user
    const user = await userService.getUserByEmail(email);
    
    if (!user) {
      logger.warn(`Login failed: No user found with email ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Log found user details (without password)
    logger.debug(`User found: ${user.username}, ID: ${user.id}`);
    
    // Make sure we have the password field
    if (!user.password) {
      logger.error(`User ${email} found but has no password field`);
      return res.status(500).json({
        success: false,
        message: 'Error with user account'
      });
    }

    // Check password using bcrypt compare
    if (!(await user.matchPassword(password))) {
      logger.warn(`Login failed: Invalid password for user ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    logger.debug(`Password matched successfully for user ${email}`);
    
    // Generate token
    const token = generateToken(user.id);
    
    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax'
    });
    
    logger.info(`User ${email} logged in successfully`);
    
    // Return successful response with token and user data
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// Logout user
const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

// Get current user
const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new ApiError('Not authenticated', 401));
    }
    
    const user = await userService.getUserById(req.user.id);
    
    if (!user) {
      return next(new ApiError('User not found', 404));
    }
    
    res.json({
      success: true,
      data: {
        id: user.id || user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    logApiError(error, req);
    next(new ApiError('Server error while fetching user data', 500));
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};
