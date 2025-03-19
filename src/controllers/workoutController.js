/**
 * Workout Controller
 * Handles workout-related HTTP requests
 */
const workoutService = require('../services/workoutService');

/**
 * Create a new workout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createWorkout = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const workoutData = { ...req.body, UserId: userId };
    const workout = await workoutService.createWorkout(workoutData);
    res.status(201).json(workout);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all workouts for the logged-in user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getUserWorkouts = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const workouts = await workoutService.getWorkoutsByUserId(userId);
    res.status(200).json(workouts);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific workout by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getWorkoutById = async (req, res, next) => {
  try {
    const id  = req.params.id;
    const workout = await workoutService.getWorkoutById(id);
    res.status(200).json(workout);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a workout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateWorkout = async (req, res, next) => {
  try {
    const id = req.params.id;
    const workoutData = req.body;
    const updatedWorkout = await workoutService.updateWorkout(id, workoutData);
    res.status(200).json(updatedWorkout);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a workout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteWorkout = async (req, res, next) => {
  try {
    const  id  = req.params.id;
    await workoutService.deleteWorkout(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

/**
 * Add an exercise to a workout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.addExerciseToWorkout = async (req, res, next) => {
  try {
    const workoutId  = req.params.wID;
    const exerciseData = req.body;
    const exercise = await workoutService.addExerciseToWorkout(workoutId, exerciseData);
    res.status(201).json(exercise);
  } catch (error) {
    next(error);
  }
};
