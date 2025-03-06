/**
 * Debug Routes for development testing
 * ONLY AVAILABLE IN DEVELOPMENT MODE
 */
const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const logger = require('../utils/logger');

// Middleware to check environment
const developmentOnly = (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ message: 'Not found' });
  }
  next();
};

// Apply middleware to all debug routes
router.use(developmentOnly);

/**
 * Log request body for debugging
 * @route POST /api/debug/log-request
 */
router.post('/log-request', (req, res) => {
  logger.info('Received request body:', req.body);
  res.json({
    status: 'logged',
    receivedData: {
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers
    }
  });
});

/**
 * Echo registration data for debugging
 * @route POST /api/debug/register
 */
router.post('/register', (req, res) => {
  const data = req.body;
  
  logger.info('Debug register route hit with data:', data);
  
  // Check for all expected fields
  const fieldStatus = {
    username: !!data.username,
    email: !!data.email,
    password: !!data.password,
    firstName: !!data.firstName,
    lastName: !!data.lastName,
  };
  
  res.json({
    status: 'received',
    fieldPresence: fieldStatus,
    data: {
      ...data,
      password: data.password ? '[REDACTED]' : null
    }
  });
});

/**
 * Debug login route
 * Tests login functionality without affecting real authentication
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Log the attempt
    logger.debug(`Debug login attempt for: ${email}`);
    
    // Try to find user but don't generate real tokens
    const user = await userService.findUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found in debug mode'
      });
    }
    
    // Sample response
    res.status(200).json({
      status: 'success',
      message: 'Debug login simulation',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    logger.error('Debug login error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * Get API info for debugging
 */
router.get('/info', (req, res) => {
  const serviceInfo = {
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    userServiceFunctions: Object.keys(userService)
  };
  
  res.status(200).json(serviceInfo);
});

/**
 * Test database connection
 */
router.get('/db-test', async (req, res) => {
  try {
    const { sequelize } = require('../models');
    await sequelize.authenticate();
    
    res.status(200).json({
      status: 'success',
      message: 'Database connection successful'
    });
  } catch (error) {
    logger.error('Database test failed:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

module.exports = router;
