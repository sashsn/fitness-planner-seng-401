/**
 * AI Controller
 * Handles AI-powered features like workout generation
 */
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');
const llmService = require('../services/llmService');

/**
 * Generate a personalized workout plan using AI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.generateWorkout = async (req, res, next) => {
  try {
    // Allow test calls without authentication in development
    // const userId = req.user ? req.user.id : 'test-user';
    const preferences = req.body;
    
    
    if (!preferences) {
      throw new ApiError(400, 'Workout preferences are required');
    }
    
    logger.info(`Generating workout plan for user with preferences: `, preferences);

    // Add user information to the request for personalization
    const userPreferences = {
      ...preferences
    };

    // Call LLM service to generate workout plan
    const workoutPlan = await llmService.generateWorkoutPlan(userPreferences);

    res.status(200).json(workoutPlan);
  } catch (error) {
    logger.error(`Workout generation error: ${error.message}`);
    next(error);
  }
};

/**
 * Check if the AI service is available
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.healthCheck = async (req, res, next) => {
  try {
    // Try to ping the LLM service
    const status = await llmService.checkHealth();
    
    res.status(200).json({
      status: 'OK',
      message: 'AI service is available',
      details: status
    });
  } catch (error) {
    logger.warn(`AI health check failed: ${error.message}`);
    res.status(503).json({
      status: 'ERROR',
      message: 'AI service is currently unavailable',
      error: error.message
    });
  }
};
