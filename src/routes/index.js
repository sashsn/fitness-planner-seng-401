/**
 * Main router that combines all API routes
 */
const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const { register } = require('../controllers/authController');
const authController = require('../controllers/authController');

// Mount user routes
router.use('/users', userRoutes);

// Handle the /debug/register route with improved error handling
router.post('/debug/register', (req, res, next) => {
  console.log('Debug register route hit, forwarding to register controller');
  try {
    register(req, res, next);
  } catch (error) {
    console.error('Error in debug register route:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed due to server error',
      error: error.message
    });
  }
});

// Authentication routes
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// Direct login route for testing
router.post('/debug/login', (req, res, next) => {
  console.log('Debug login route hit, forwarding to login controller');
  try {
    authController.login(req, res, next);
  } catch (error) {
    console.error('Error in debug login route:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed due to server error',
      error: error.message
    });
  }
});

// Add a test endpoint to verify API connectivity
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Log all requests to API for debugging
router.use((req, res, next) => {
  console.log(`API Request: ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

module.exports = router;
