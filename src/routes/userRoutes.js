/**
 * User Routes
 * Handles user management endpoints
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController'); // *UPDATE* Import userController
const { protect } = require('../middleware/authMiddleware'); // *UPDATE* Import middleware to protect routes

router.get('/profile', protect, userController.getProfile); // *UPDATE* Added this route to fetch user data

/**
 * @route POST /api/users/register
 * @description Register a new user
 * @access Public
 */
router.post('/register', (req, res, next) => {
  console.log('User registration route hit, forwarding to register controller');
  try {
    authController.register(req, res, next);
  } catch (error) {
    console.error('Error in registration route:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed due to server error',
      error: error.message
    });
  }
});

/**
 * @route POST /api/users/login
 * @description Login a user
 * @access Public
 */
router.post('/login', (req, res, next) => {
  console.log('User login route hit, forwarding to login controller');
  try {
    authController.login(req, res, next);
  } catch (error) {
    console.error('Error in login route:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed due to server error',
      error: error.message
    });
  }
});

module.exports = router;
