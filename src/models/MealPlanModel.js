/**
 * Meal Plan Model
 * 
 * This model handles all database operations related to meal plans:
 * - Creating meal plans
 * - Retrieving meal data
 * - Updating meal information
 * - Managing dietary preferences
 * 
 * @class MealPlanModel
 */

/**
 * Create a new meal plan
 * @function create
 * @param {number} userId - User ID
 * @param {Object} planData - Meal plan data
 * @returns {Promise<Object>} Created meal plan
 */

/**
 * Get a meal plan by ID
 * @function getById
 * @param {number} planId - Plan ID
 * @returns {Promise<Object>} Meal plan
 */

/**
 * Get a user's current meal plan
 * @function getCurrentPlanByUserId
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Current meal plan
 */

/**
 * Update a meal plan
 * @function update
 * @param {number} planId - Plan ID
 * @param {Object} planData - Updated plan data
 * @returns {Promise<Object>} Updated meal plan
 */

/**
 * Delete a meal plan
 * @function delete
 * @param {number} planId - Plan ID
 * @returns {Promise<boolean>} Success status
 */

/**
 * Get a user's meal plan history
 * @function getUserMealPlanHistory
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of past meal plans
 */