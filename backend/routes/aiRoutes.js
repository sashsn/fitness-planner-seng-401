const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth'); // Assuming auth middleware exists

/**
 * @route   POST /api/ai/workout
 * @desc    Generate a workout plan based on user preferences
 * @access  Private
 */
router.post('/workout', auth, aiController.generateWorkoutPlan);

module.exports = router;
