/**
 * User Routes
 * Handles user-related endpoints
 */
const express = require('express');
const router = express.Router();
const { register, login, logout, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Enhanced routes with debug logging and proper response handling
router.post('/register', (req, res, next) => {
  console.log('User register endpoint hit with:', {
    email: req.body.email,
    username: req.body.username,
    hasPassword: !!req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });
  register(req, res, next);
});

router.post('/login', (req, res, next) => {
  console.log('User login endpoint hit with:', { 
    email: req.body.email, 
    hasPassword: !!req.body.password 
  });
  login(req, res, next);
});

router.post('/logout', logout);

// Profile endpoint (protected)
router.get('/profile', protect, (req, res, next) => {
  console.log('Profile endpoint hit by user:', req.user?.id);
  getCurrentUser(req, res, next);
});

module.exports = router;
