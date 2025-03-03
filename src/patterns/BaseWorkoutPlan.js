/**
 * Base Workout Plan Abstract Class
 * 
 * This abstract class defines the interface for all workout plan types.
 * It is part of the Factory Method pattern for creating workout plans.
 * 
 * @class BaseWorkoutPlan
 * @abstract
 */

/**
 * Generate workout plan
 * @function generatePlan
 * @param {Object} userPreferences - User fitness preferences
 * @returns {Promise<Object>} Generated workout plan
 * @abstract
 */

/**
 * Calculate appropriate workout intensity
 * @function calculateIntensity
 * @param {Object} userMetrics - User fitness metrics
 * @returns {Object} Calculated intensity parameters
 * @abstract
 */

/**
 * Generate workout schedule
 * @function generateSchedule
 * @param {number} daysPerWeek - Preferred workout days per week
 * @returns {Array} Workout schedule
 * @abstract
 */

/**
 * Adjust plan based on user feedback
 * @function adjustPlan
 * @param {Object} feedback - User feedback data
 * @returns {Promise<Object>} Adjusted workout plan
 * @abstract
 */