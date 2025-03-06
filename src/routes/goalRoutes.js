/**
 * Goal Routes
 * Defines API endpoints for fitness goal-related operations
 */
const express = require('express');
const goalController = require('../controllers/goalController');
const { auth } = require('../middleware/auth');
const { validateGoal } = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /api/goals
 * @description Create a new fitness goal
 * @access Private
 */
router.post('/', auth, validateGoal, goalController.createGoal);

/**
 * @route GET /api/goals
 * @description Get all fitness goals for the logged-in user
 * @access Private
 */
router.get('/', auth, goalController.getUserGoals);

/**
 * @route GET /api/goals/:id
 * @description Get a specific fitness goal by ID
 * @access Private
 */
router.get('/:id', auth, goalController.getGoalById);

/**
 * @route PUT /api/goals/:id
 * @description Update a fitness goal
 * @access Private
 */
router.put('/:id', auth, validateGoal, goalController.updateGoal);

/**
 * @route DELETE /api/goals/:id
 * @description Delete a fitness goal
 * @access Private
 */
router.delete('/:id', auth, goalController.deleteGoal);

/**
 * @route PATCH /api/goals/:id/progress
 * @description Track progress for a specific fitness goal
 * @access Private
 */
router.patch('/:id/progress', auth, goalController.trackGoalProgress);

module.exports = router;
