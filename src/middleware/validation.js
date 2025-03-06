/**
 * Request validation middleware
 * Validates request data using Joi schemas
 */
const Joi = require('joi');
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Generic validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  // Log the body before validation for debugging
  logger.debug('Validating request body:', { 
    body: req.body,
    hasUsername: !!req.body.username,
    path: req.path
  });
  
  const { error } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    logger.warn('Validation error:', { errors, path: req.path });
    return next(new ApiError(400, 'Validation error', errors));
  }
  
  logger.debug('Validation passed');
  next();
};

// User registration schema
const userRegistrationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().allow('', null),
  lastName: Joi.string().allow('', null),
  dateOfBirth: Joi.date().iso().allow(null),
  height: Joi.number().positive().allow(null),
  weight: Joi.number().positive().allow(null)
});

// User update schema
const userUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  firstName: Joi.string().allow('', null),
  lastName: Joi.string().allow('', null),
  dateOfBirth: Joi.date().iso().allow(null),
  height: Joi.number().positive().allow(null),
  weight: Joi.number().positive().allow(null),
  email: Joi.string().email()
});

// Workout schema
const workoutSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  date: Joi.date().iso(),
  duration: Joi.number().integer().min(0),
  caloriesBurned: Joi.number().min(0),
  workoutType: Joi.string().valid('cardio', 'strength', 'flexibility', 'balance', 'other'),
  isCompleted: Joi.boolean()
});

// Exercise schema
const exerciseSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  sets: Joi.number().integer().min(0),
  reps: Joi.number().integer().min(0),
  weight: Joi.number().min(0),
  duration: Joi.number().integer().min(0),
  distance: Joi.number().min(0),
  restTime: Joi.number().integer().min(0),
  notes: Joi.string().allow('', null)
});

// Meal schema
const mealSchema = Joi.object({
  name: Joi.string().required(),
  date: Joi.date().iso(),
  mealType: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').required(),
  calories: Joi.number().min(0),
  protein: Joi.number().min(0),
  carbs: Joi.number().min(0),
  fat: Joi.number().min(0),
  description: Joi.string().allow('', null),
  notes: Joi.string().allow('', null)
});

// Fitness Goal schema
const goalSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  goalType: Joi.string().valid('weight', 'strength', 'endurance', 'nutrition', 'other').required(),
  targetValue: Joi.number().required(),
  currentValue: Joi.number().allow(null),
  unit: Joi.string().allow('', null),
  startDate: Joi.date().iso(),
  targetDate: Joi.date().iso().allow(null),
  isCompleted: Joi.boolean()
});

// Export validation middleware
module.exports = {
  validateUserRegistration: validate(userRegistrationSchema),
  validateUserUpdate: validate(userUpdateSchema),
  validateWorkout: validate(workoutSchema),
  validateExercise: validate(exerciseSchema),
  validateMeal: validate(mealSchema),
  validateGoal: validate(goalSchema)
};
