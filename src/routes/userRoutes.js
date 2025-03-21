/**
 * User Routes
 * Handles user management endpoints
 */
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); 
const userController = require('../controllers/userController'); 


/**
 * @route POST /api/users/register
 * @description Register a new user
 * @access Public
 */
router.post('/register', userController.register);

/**
 * @route POST /api/users/login
 * @description Authenticate user & get token
 * @access Public
 */
router.post('/login', userController.login);

/**
 * @route GET /api/users/profile
 * @description Get user profile
 * @access Private
 */
router.get('/profile', authMiddleware.protect, userController.getProfile);

/**
 * @route PUT /api/users/profile
 * @description Update user profile
 * @access Private
 */
router.put('/profile', authMiddleware.protect, userController.updateProfile);

/**
 * @route DELETE /api/users/delete
 * @description Delete user account
 * @access Private
 */
router.delete('/delete', authMiddleware.protect, userController.deleteAccount);

/**
 * @route POST /api/users/logout
 * @description Logout a user
 * @access Private
 */
router.post('/logout', authMiddleware.protect, userController.logout);

module.exports = router;
