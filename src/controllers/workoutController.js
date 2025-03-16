/**
 * Workout Controller
 * Handles workout-related HTTP requests
 */
const workoutService = require('../services/workoutService');
const logger = require('../utils/logger');
const { ApiError } = require('../utils/errors');

/**
 * Get a consistent user ID for the request
 * @param {Object} req - Express request object
 * @returns {string} User ID
 */
const getUserId = (req) => {
  // In production, always use the authenticated user ID
  if (process.env.NODE_ENV === 'production') {
    if (!req.user?.id) {
      throw new ApiError(401, 'Authentication required');
    }
    return req.user.id;
  }

  // In development, use authenticated user if available, or test-user as fallback
  return req.user?.id || 'test-user';
};

/**
 * Create a new workout
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createWorkout = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    logger.debug(`Creating workout for user: ${userId}`);
    
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
    const userId = getUserId(req);
    logger.debug(`Getting workouts for user: ${userId}`);
    
    const workouts = await workoutService.getWorkoutsByUserId(userId);
    res.status(200).json(workouts);
  } catch (error) {
    logger.error(`Error fetching workouts: ${error.message}`);
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
    const { id } = req.params;
    const userId = getUserId(req);
    const workout = await workoutService.getWorkoutById(id, userId);
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
    const { id } = req.params;
    const userId = getUserId(req);
    const workoutData = req.body;
    const updatedWorkout = await workoutService.updateWorkout(id, userId, workoutData);
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
    const { id } = req.params;
    const userId = getUserId(req);
    await workoutService.deleteWorkout(id, userId);
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
    const { workoutId } = req.params;
    const userId = getUserId(req);
    const exerciseData = req.body;
    const exercise = await workoutService.addExerciseToWorkout(workoutId, userId, exerciseData);
    res.status(201).json(exercise);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all AI-generated workout plans for the logged-in user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getUserWorkoutPlans = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    logger.info(`Getting AI workout plans for user: ${userId}`);
    
    const workoutPlans = await workoutService.getUserWorkoutPlans(userId);
    
    logger.info(`Found ${workoutPlans.length} AI-generated workout plans`);
    res.status(200).json(workoutPlans);
  } catch (error) {
    logger.error(`Error getting workout plans: ${error.message}`);
    next(error);
  }
};
