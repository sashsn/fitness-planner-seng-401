/**
 * Workout Routes
 * Defines API endpoints for workout-related operations
 */
const express = require('express');
const workoutController = require('../controllers/workoutController');
const { auth } = require('../middleware/auth');
const { validateWorkout, validateExercise } = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /api/workouts
 * @description Create a new workout
 * @access Private
 */
router.post('/', auth, validateWorkout, workoutController.createWorkout);

/**
 * @route GET /api/workouts
 * @description Get all workouts for the logged-in user
 * @access Private
 */
router.get('/', auth, workoutController.getUserWorkouts);

/**
 * @route GET /api/workouts/:id
 * @description Get a specific workout by ID
 * @access Private
 */
router.get('/:id', auth, workoutController.getWorkoutById);

/**
 * @route PUT /api/workouts/:id
 * @description Update a workout
 * @access Private
 */
router.put('/:id', auth, validateWorkout, workoutController.updateWorkout);

/**
 * @route DELETE /api/workouts/:id
 * @description Delete a workout
 * @access Private
 */
router.delete('/:id', auth, workoutController.deleteWorkout);

/**
 * @route POST /api/workouts/:workoutId/exercises
 * @description Add an exercise to a workout
 * @access Private
 */
router.post('/:workoutId/exercises', auth, validateExercise, workoutController.addExerciseToWorkout);

module.exports = router;
