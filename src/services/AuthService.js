/**
 * Authentication Service
 * 
 * This service handles all authentication-related business logic including:
 * - User registration and validation
 * - Login authentication
 * - Password hashing and verification
 * - JWT token generation and validation
 * 
 * @class AuthService
 */

/**
 * Register a new user
 * @function register
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Newly created user object
 */

/**
 * Validate login credentials
 * @function validateLogin
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object with authentication token
 */

/**
 * Generate JWT token
 * @function generateToken
 * @param {Object} user - User object
 * @returns {string} JWT token
 */

/**
 * Verify JWT token
 * @function verifyToken
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */

/**
 * Hash password
 * @function hashPassword
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */