/**
 * Nutrition Controller
 * Handles nutrition-related functionality
 */
const logger = require('../utils/logger');
const { ApiError } = require('../utils/errors');
const nutritionService = require('../services/nutritionService');

/**
 * Create a new meal entry
 */
exports.createMeal = async (req, res, next) => {
  try {
    logger.debug('Creating meal entry');
    // Use req.user.id (or fallback to a dev user) and include it as UserId
    const userId = req.params.userId;
    const mealData = { ...req.body, UserId: userId };
    const meal = await nutritionService.createMeal(mealData);

    res.status(201).json({
      success: true,
      message: 'Meal created successfully',
      data: meal
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all meal entries for the logged-in user
 */
exports.getUserMeals = async (req, res, next) => {
  try {
    logger.debug('Getting user meals');
    const userId = req.params.userId;
    const meals = await nutritionService.getMealsByUserId(userId);

    res.status(200).json({
      success: true,
      data: meals
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific meal entry by ID
 */
exports.getMealById = async (req, res, next) => {
  try {
    const  id  = req.params.id;
    logger.debug(`Getting meal by ID: ${id}`);

    const meal = await nutritionService.getMealById(id);
    res.status(200).json({
      success: true,
      data: meal
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a meal entry
 */
exports.updateMeal = async (req, res, next) => {
  try {
    const  id  = req.params.id;
    
    const updatedMeal = await nutritionService.updateMeal(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Meal updated successfully',
      data: updatedMeal
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a meal entry
 */
exports.deleteMeal = async (req, res, next) => {
  try {
    const id = req.params.id;

    await nutritionService.deleteMeal(id);
    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get nutrition summary for a specific date range
 */
exports.getNutritionSummary = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const userId = req.params.userId;
    logger.debug(`Getting nutrition summary from ${from} to ${to}`);

    const summary = await nutritionService.getNutritionSummary(userId, from, to);
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};
