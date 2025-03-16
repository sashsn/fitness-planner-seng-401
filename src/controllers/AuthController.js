const userService = require('../services/UserService');
const User = require('../models').User;
const { ApiError, logApiError } = require('../utils/errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const db = require('../models');
const config = require('../config/server'); // Import server config

// Generate JWT Token using the same JWT_SECRET as in auth middleware
const generateToken = (id) => {
  const secret = config.jwtSecret; // Use the same config value as auth middleware
  logger.debug(`Generating token with secret prefix: ${secret.substring(0, 3)}...`);
  
  return jwt.sign({ id }, secret, {
    expiresIn: config.jwtExpire
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

    try {
      // Use userService.loginUser
      const result = await userService.loginUser(email, password);
      
      // Check if session is available before setting userId
      if (req.session) {
        // Set user ID in session
        req.session.userId = result.user.id;
        logger.debug(`Session ID ${req.session.id} created for user ${result.user.id}`);
      } else {
        logger.warn('Session object not available - session storage might be misconfigured');
        // Continue without setting session (will rely on token-based auth)
      }
      
      logger.info(`User ${email} logged in successfully`);
      
      // Return successful response with token and user data
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token: result.token,
        user: result.user
      });
    } catch (error) {
      if (error instanceof ApiError) {
        logger.warn(`Login failed: ${error.message}`);
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      throw error;
    }
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
