/**
 * Workout Routes
 * Handles workout management endpoints
 */
const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { auth, optionalAuth } = require('../middleware/auth');
const { validateWorkout } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

// Use optional auth for development mode and required auth for production
const authMiddleware = process.env.NODE_ENV === 'production' 
  ? [auth] 
  : [optionalAuth];

/**
 * @route GET /api/workouts
 * @description Get all workouts for the logged-in user
 * @access Private
 */
router.get('/', authMiddleware, asyncHandler(workoutController.getUserWorkouts));

/**
 * @route GET /api/workouts/plans
 * @description Get all AI-generated workout plans for the user
 * @access Private
 */
router.get('/plans', authMiddleware, asyncHandler(workoutController.getUserWorkoutPlans));

/**
 * @route POST /api/workouts
 * @description Create a new workout
 * @access Private
 */
router.post('/', authMiddleware, validateWorkout, asyncHandler(workoutController.createWorkout));

/**
 * @route GET /api/workouts/:id
 * @description Get a specific workout by ID
 * @access Private
 */
router.get('/:id', authMiddleware, asyncHandler(workoutController.getWorkoutById));

/**
 * @route PUT /api/workouts/:id
 * @description Update a workout
 * @access Private
 */
router.put('/:id', authMiddleware, validateWorkout, asyncHandler(workoutController.updateWorkout));

/**
 * @route DELETE /api/workouts/:id
 * @description Delete a workout
 * @access Private
 */
router.delete('/:id', authMiddleware, asyncHandler(workoutController.deleteWorkout));

/**
 * @route POST /api/workouts/:workoutId/exercises
 * @description Add an exercise to a workout
 * @access Private
 */
router.post('/:workoutId/exercises', authMiddleware, asyncHandler(workoutController.addExerciseToWorkout));

module.exports = router;
