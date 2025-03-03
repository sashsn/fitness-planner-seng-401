/**
 * User Model
 * 
 * This model handles all database operations related to users:
 * - Creating users
 * - Retrieving user data
 * - Updating user information
 * - Authentication-related queries
 * 
 * @class UserModel
 */

/**
 * Create a new user in the database
 * @function create
 * @param {Object} userData - User data to insert
 * @returns {Promise<Object>} Created user object
 */

/**
 * Find a user by ID
 * @function findById
 * @param {number} id - User ID
 * @returns {Promise<Object>} User object
 */

/**
 * Find a user by email
 * @function findByEmail
 * @param {string} email - User email
 * @returns {Promise<Object>} User object
 */

/**
 * Update a user's information
 * @function update
 * @param {number} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user object
 */

/**
 * Check if email exists in database
 * @function emailExists
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} Whether email exists
 */

/**
 * Delete a user
 * @function delete
 * @param {number} id - User ID
 * @returns {Promise<boolean>} Success status
 */