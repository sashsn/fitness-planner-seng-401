/**
 * Fitness Preferences Model
 * 
 * This model handles all database operations related to user fitness preferences:
 * - Storing fitness goals
 * - Exercise preferences
 * - Workout frequency and duration
 * - Physical limitations and other preferences
 * 
 * @class FitnessPreferencesModel
 */

/**
 * Create fitness preferences for a user
 * @function create
 * @param {number} userId - User ID
 * @param {Object} preferencesData - Fitness preferences data
 * @returns {Promise<Object>} Created preferences object
 */

/**
 * Get fitness preferences for a user
 * @function getByUserId
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User's fitness preferences
 */

/**
 * Update fitness preferences
 * @function update
 * @param {number} userId - User ID
 * @param {Object} preferencesData - Updated preferences data
 * @returns {Promise<Object>} Updated preferences object
 */

/**
 * Delete fitness preferences
 * @function delete
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} Success status
 */