const aiService = require('../services/aiService');

/**
 * Controller for AI-related endpoints
 */
const aiController = {
  /**
   * Generate a workout plan based on user preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  generateWorkoutPlan: async (req, res) => {
    try {
      // Validate request body
      const preferences = req.body;
      
      if (!preferences) {
        return res.status(400).json({ message: 'Workout preferences are required' });
      }
      
      // Required fields validation
      const requiredFields = [
        'fitnessGoal',
        'experienceLevel',
        'workoutDaysPerWeek',
        'workoutDuration',
        'availableDays',
        'preferredWorkoutTypes',
        'equipmentAccess'
      ];
      
      for (const field of requiredFields) {
        if (!preferences[field]) {
          return res.status(400).json({ message: `${field} is required` });
        }
      }
      
      // Generate workout plan
      const workoutPlan = await aiService.generateWorkoutPlan(preferences);
      
      return res.status(200).json(workoutPlan);
    } catch (error) {
      console.error('Error in generateWorkoutPlan controller:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      
      // Handle OpenAI API specific errors
      if (error.response && error.response.status) {
        const status = error.response.status;
        
        // Rate limiting or quota exceeded
        if (status === 429) {
          return res.status(429).json({ message: 'Rate limit exceeded. Please try again later.' });
        }
        
        // Authentication error
        if (status === 401) {
          return res.status(500).json({ message: 'Server configuration error with AI provider.' });
        }
      }
      
      return res.status(500).json({ message: 'Failed to generate workout plan' });
    }
  }
};

module.exports = aiController;
