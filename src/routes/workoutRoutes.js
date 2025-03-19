/**
 * Workout Routes
 * Handles workout management endpoints
 */
const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

// Create a new workout for a specific user
router.post('/user/:userId', workoutController.createWorkout);

// Get all workouts for a specific user
router.get('/user/:userId', workoutController.getUserWorkouts);

// Get a specific workout by its workout ID
router.get('/:id', workoutController.getWorkoutById);

// Update a specific workout by its workout ID
router.put('/:id', workoutController.updateWorkout);

// Delete a specific workout by its workout ID
router.delete('/:id', workoutController.deleteWorkout);

router.post('/:wID/exercises', workoutController.addExerciseToWorkout);

module.exports = router;
