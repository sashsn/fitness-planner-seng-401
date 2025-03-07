/**
 * Workout Service
 * Business logic for workout-related operations
 */
const { Workout, Exercise } = require('../models');
const { ApiError } = require('../utils/errors');

/**
 * Create a new workout
 * @param {Object} workoutData - Workout data
 * @returns {Object} Created workout
 */
exports.createWorkout = async (workoutData) => {
  const workout = await Workout.create(workoutData);
  return workout;
};

/**
 * Get all workouts for a user
 * @param {string} userId - User ID
 * @returns {Array} List of workouts
 */
exports.getWorkoutsByUserId = async (userId) => {
  const workouts = await Workout.findAll({
    where: { UserId: userId },
    order: [['date', 'DESC']],
    include: [{ model: Exercise }]
  });
  
  return workouts;
};

/**
 * Get a specific workout by ID
 * @param {string} workoutId - Workout ID
 * @param {string} userId - User ID
 * @returns {Object} Workout data
 */
exports.getWorkoutById = async (workoutId, userId) => {
  const workout = await Workout.findOne({
    where: { id: workoutId, UserId: userId },
    include: [{ model: Exercise }]
  });
  
  if (!workout) {
    throw new ApiError(404, 'Workout not found');
  }
  
  return workout;
};

/**
 * Update a workout
 * @param {string} workoutId - Workout ID
 * @param {string} userId - User ID
 * @param {Object} workoutData - Updated workout data
 * @returns {Object} Updated workout
 */
exports.updateWorkout = async (workoutId, userId, workoutData) => {
  const workout = await Workout.findOne({
    where: { id: workoutId, UserId: userId }
  });
  
  if (!workout) {
    throw new ApiError(404, 'Workout not found');
  }
  
  await workout.update(workoutData);
  
  // Fetch updated workout with exercises
  const updatedWorkout = await Workout.findByPk(workoutId, {
    include: [{ model: Exercise }]
  });
  
  return updatedWorkout;
};

/**
 * Delete a workout
 * @param {string} workoutId - Workout ID
 * @param {string} userId - User ID
 * @returns {boolean} Success status
 */
exports.deleteWorkout = async (workoutId, userId) => {
  const workout = await Workout.findOne({
    where: { id: workoutId, UserId: userId }
  });
  
  if (!workout) {
    throw new ApiError(404, 'Workout not found');
  }
  
  await Exercise.destroy({
    where: { WorkoutId: workoutId }
  });
  
  await workout.destroy();
  return true;
};

/**
 * Add an exercise to a workout
 * @param {string} workoutId - Workout ID
 * @param {string} userId - User ID
 * @param {Object} exerciseData - Exercise data
 * @returns {Object} Created exercise
 */
exports.addExerciseToWorkout = async (workoutId, userId, exerciseData) => {
  // Check if the workout exists and belongs to the user
  const workout = await Workout.findOne({
    where: { id: workoutId, UserId: userId }
  });
  
  if (!workout) {
    throw new ApiError(404, 'Workout not found');
  }
  
  // Create the exercise
  const exercise = await Exercise.create({
    ...exerciseData,
    WorkoutId: workoutId
  });
  
  return exercise;
};
