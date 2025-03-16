/**
 * Workout Service
 * Business logic for workout-related operations
 */
const { Workout, Exercise, sequelize } = require('../models');
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');
const NodeCache = require('node-cache');

// Create a cache for workout plans with 30 minute TTL
const workoutCache = new NodeCache({ 
  stdTTL: 1800, // 30 minutes
  checkperiod: 120, // Check for expired entries every 2 minutes
  useClones: false // Don't clone objects (for better memory usage)
});

/**
 * Create a new workout
 * @param {Object} workoutData - Workout data
 * @returns {Object} Created workout
 */
exports.createWorkout = async (workoutData) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Check if generatedPlan is present and compress large data if needed
    if (workoutData.generatedPlan) {
      try {
        // Ensure it's stored as a string and optimize
        if (typeof workoutData.generatedPlan !== 'string') {
          // Remove non-essential fields to reduce size
          const plan = workoutData.generatedPlan;
          if (plan.workoutPlan && plan.workoutPlan.schedule) {
            // Limit deep nested objects
            plan.workoutPlan.schedule = plan.workoutPlan.schedule.map(week => ({
              ...week,
              days: week.days.map(day => ({
                ...day,
                // Keep only essential exercise data
                exercises: day.exercises ? day.exercises.map(ex => ({
                  name: ex.name,
                  category: ex.category,
                  targetMuscles: ex.targetMuscles,
                  sets: ex.sets,
                  reps: ex.reps,
                  weight: ex.weight,
                  restBetweenSets: ex.restBetweenSets,
                  notes: ex.notes,
                  alternatives: ex.alternatives,
                })) : []
              }))
            }));
          }
          workoutData.generatedPlan = JSON.stringify(plan);
        }
      } catch (error) {
        // If there's an error with generatedPlan, log it and remove the property
        logger.warn(`Error handling generatedPlan: ${error.message}`);
        delete workoutData.generatedPlan;
      }
    }
    
    // Create workout and related exercises in a single transaction
    const workout = await Workout.create(workoutData, { 
      transaction,
      // Only include essential fields in the returned object
      returning: ['id', 'name', 'description', 'date', 'workoutType', 'UserId']
    });
    
    // If there are exercises, create them in batch
    if (workoutData.exercises && Array.isArray(workoutData.exercises) && workoutData.exercises.length > 0) {
      // Prepare exercises data with workout ID
      const exercisesData = workoutData.exercises.map(exercise => ({
        ...exercise,
        WorkoutId: workout.id
      }));
      
      // Create all exercises in a single batch operation
      await Exercise.bulkCreate(exercisesData, { transaction });
    }
    
    await transaction.commit();
    
    // Cache the newly created workout if it's an AI-generated plan
    if (workoutData.workoutType === 'AI Generated' && workoutData.generatedPlan) {
      const cacheKey = `workout_${workout.id}`;
      workoutCache.set(cacheKey, workout);
    }
    
    return workout;
  } catch (error) {
    await transaction.rollback();
    
    // Check if error is related to missing column
    if (error.message && error.message.includes('column') && error.message.includes('does not exist')) {
      logger.warn('Column does not exist, creating workout without that column');
      // Remove problematic fields
      const safeData = { ...workoutData };
      delete safeData.generatedPlan;
      return await Workout.create(safeData);
    }
    throw error;
  }
};

/**
 * Get all workouts for a user with optimized queries
 * @param {string} userId - User ID
 * @returns {Array} List of workouts
 */
exports.getWorkoutsByUserId = async (userId) => {
  try {
    logger.info(`Getting workouts for user: ${userId}`);

    // Get column names to ensure we only fetch existing columns
    const tableDescription = await sequelize.getQueryInterface().describeTable('Workouts');
    const columnNames = Object.keys(tableDescription);

    // Define attributes to fetch, excluding any that don't exist
    const attributes = [
      'id',
      'name',
      'description',
      'date', 
      'duration',
      'workoutType',
      'isCompleted',
      'caloriesBurned',
      'notes',
      'createdAt',
      'updatedAt',
      'UserId',
      'generatedPlan'
    ].filter(attr => columnNames.includes(attr));

    // Only include 'intensity' if it exists in the table
    if (columnNames.includes('intensity')) {
      attributes.push('intensity');
    }

    // Fetch workouts with only existing columns
    const workouts = await Workout.findAll({
      where: { UserId: userId },
      attributes,
      order: [['date', 'DESC']]
    });

    logger.info(`Found ${workouts.length} workouts for user ${userId}`);
    return workouts;
  } catch (error) {
    logger.error(`Error fetching workouts: ${error.message}`);
    throw error;
  }
};

/**
 * Get a specific workout by ID with caching
 * @param {string} workoutId - Workout ID
 * @param {string} userId - User ID
 * @returns {Object} Workout data
 */
exports.getWorkoutById = async (workoutId, userId) => {
  // Check cache first
  const cacheKey = `workout_${workoutId}`;
  const cachedWorkout = workoutCache.get(cacheKey);
  
  if (cachedWorkout && cachedWorkout.UserId === userId) {
    logger.debug(`Cache hit for workout ${workoutId}`);
    return cachedWorkout;
  }
  
  const workout = await Workout.findOne({
    where: { id: workoutId, UserId: userId },
    include: [{ model: Exercise }]
  });
  
  if (!workout) {
    throw new ApiError(404, 'Workout not found');
  }
  
  // Cache the result if it's an AI-generated workout plan
  if (workout.workoutType === 'AI Generated') {
    workoutCache.set(cacheKey, workout);
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
  
  // Handle generatedPlan data if it exists
  if (workoutData.generatedPlan) {
    // Ensure it's stored as a string
    if (typeof workoutData.generatedPlan !== 'string') {
      workoutData.generatedPlan = JSON.stringify(workoutData.generatedPlan);
    }
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

/**
 * Get all AI-generated workout plans for a user with optimized queries
 * @param {string} userId - User ID
 * @returns {Array} List of AI-generated workout plans
 */
exports.getUserWorkoutPlans = async (userId) => {
  logger.debug(`Finding AI workout plans for user: ${userId}`);
  
  // Check cache for user's workout plans
  const cacheKey = `user_${userId}_workout_plans`;
  const cachedPlans = workoutCache.get(cacheKey);
  
  if (cachedPlans) {
    logger.debug(`Cache hit for user ${userId} workout plans`);
    return cachedPlans;
  }
  
  try {
    // Try to find AI-generated workouts with optimized query
    try {
      const workoutPlans = await Workout.findAll({
        where: { 
          UserId: userId,
          workoutType: 'AI Generated'
        },
        order: [['createdAt', 'DESC']],
        // Include only necessary fields
        attributes: [
          'id', 'name', 'description', 'date', 
          'duration', 'workoutType', 'isCompleted', 
          'createdAt', 'updatedAt', 'UserId', 'generatedPlan'
        ],
        include: [{ 
          model: Exercise,
          // Limit exercise data to essentials
          attributes: ['id', 'name', 'sets', 'reps']
        }]
      });
      
      // Cache the results for improved performance
      if (workoutPlans && workoutPlans.length > 0) {
        workoutCache.set(cacheKey, workoutPlans, 3600); // Cache for 1 hour
      }
      
      logger.debug(`Found ${workoutPlans.length} AI-generated workout plans`);
      return workoutPlans;
    } catch (error) {
      // If error is about missing column, return empty array
      if (error.message && error.message.includes('column') && error.message.includes('does not exist')) {
        logger.warn('Column does not exist for AI workout plans, returning empty array');
        return [];
      }
      throw error;
    }
  } catch (error) {
    logger.error(`Error finding workout plans: ${error.message}`);
    throw new ApiError(500, `Error finding workout plans: ${error.message}`);
  }
};
