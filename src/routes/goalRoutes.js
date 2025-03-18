/**
 * Goal Routes
 * Handles fitness goals management endpoints
 */
const express = require('express');
const router = express.Router();

const goalController = require('../controllers/goalController'); // Import Goal Controller


/**
 * Routes using controller functions
 */

// Get all goals for the logged-in user
router.get('/:id', goalController.getUserGoals);

// Create a new goal
router.post('/:id', goalController.createGoal);

// Get a specific goal by ID
router.get('/getGoal/:id', goalController.getGoalById);

// Update a goal
router.put('/:id', goalController.updateGoal);

// Delete a goal
router.delete('/:id', goalController.deleteGoal);

// Track progress on a goal
router.patch('/:id/progress', goalController.trackGoalProgress);


module.exports = router;
