/**
 * User Routes
 * Handles user-related endpoints
 */
const express = require('express');
const router = express.Router();
const { register, login, logout, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Enhanced routes with debug logging
router.post('/register', (req, res, next) => {
  console.log('User register endpoint hit');
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
router.get('/me', protect, getCurrentUser);

module.exports = router;
