/**
 * Nutrition Controller
 * Handles nutrition/meal-related HTTP requests
 */
const nutritionService = require('../services/nutritionService');

/**
 * Create a new meal entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createMeal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const mealData = { ...req.body, UserId: userId };
    const meal = await nutritionService.createMeal(mealData);
    res.status(201).json(meal);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all meal entries for the logged-in user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getUserMeals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const meals = await nutritionService.getMealsByUserId(userId);
    res.status(200).json(meals);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific meal entry by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getMealById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const meal = await nutritionService.getMealById(id, userId);
    res.status(200).json(meal);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a meal entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateMeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const mealData = req.body;
    const updatedMeal = await nutritionService.updateMeal(id, userId, mealData);
    res.status(200).json(updatedMeal);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a meal entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteMeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await nutritionService.deleteMeal(id, userId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

/**
 * Get nutrition summary for a specific date range
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getNutritionSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    const summary = await nutritionService.getNutritionSummary(userId, startDate, endDate);
    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
};
