/**
 * Workout Plan Model
 * 
 * This model handles all database operations related to workout plans:
 * - Creating workout plans
 * - Retrieving workout data
 * - Updating workout information
 * - Managing workout schedules
 * 
 * @class WorkoutPlanModel
 */

/**
 * Create a new workout plan
 * @function create
 * @param {number} userId - User ID
 * @param {Object} planData - Workout plan data
 * @returns {Promise<Object>} Created workout plan
 */

/**
 * Get a workout plan by ID
 * @function getById
 * @param {number} planId - Plan ID
 * @returns {Promise<Object>} Workout plan
 */

/**
 * Get a user's current workout plan
 * @function getCurrentPlanByUserId
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Current workout plan
 */

/**
 * Update a workout plan
 * @function update
 * @param {number} planId - Plan ID
 * @param {Object} planData - Updated plan data
 * @returns {Promise<Object>} Updated workout plan
 */

/**
 * Delete a workout plan
 * @function delete
 * @param {number} planId - Plan ID
 * @returns {Promise<boolean>} Success status
 */

/**
 * Get a user's workout history
 * @function getUserWorkoutHistory
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of past workout plans
 */