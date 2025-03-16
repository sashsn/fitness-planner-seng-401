/**
 * User Routes
 * Handles user management endpoints
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route POST /api/users/register
 * @description Register a new user
 * @access Public
 */
router.post('/register', asyncHandler(userController.register));

/**
 * @route POST /api/users/login
 * @description Login a user
 * @access Public
 */
router.post('/login', asyncHandler(userController.login));

/**
 * @route POST /api/users/logout
 * @description Logout a user
 * @access Private
 */
router.post('/logout', auth, asyncHandler(userController.logout));

/**
 * @route GET /api/users/profile
 * @description Get user profile
 * @access Private
 */
router.get('/profile', auth, asyncHandler(userController.getProfile));

/**
 * @route PUT /api/users/profile
 * @description Update user profile
 * @access Private
 */
router.put('/profile', auth, asyncHandler(userController.updateProfile));

/**
 * @route POST /api/users/change-password
 * @description Change user password
 * @access Private
 */
router.post('/change-password', auth, asyncHandler(userController.changePassword));

/**
 * @route DELETE /api/users/account
 * @description Delete user account
 * @access Private
 */
router.delete('/account', auth, asyncHandler(userController.deleteAccount));

/**
 * @route GET /api/users/me
 * @description Get current user
 * @access Private
 */
router.get('/me', auth, asyncHandler(userController.getCurrentUser));

module.exports = router;
