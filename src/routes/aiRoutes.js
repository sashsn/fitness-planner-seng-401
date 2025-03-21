/**
 * AI Routes
 * Defines API endpoints for AI-powered features like workout generation
 */
const express = require('express');
const aiController = require('../controllers/aiController');

const router = express.Router();

// Add simple test route that doesn't rely on controller
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'AI routes are correctly registered' });
});

/**
 * @route POST /api/ai/workout
 * @description Generate a personalized workout plan using AI
 * @access Private or Public in development
 */

router.post('/workout',  aiController.generateWorkout);

/**
 * @route GET /api/ai/health
 * @description Check if the AI service is available
 * @access Public
 */
router.get('/health', aiController.healthCheck);

module.exports = router;
