/**
 * Nutrition Service
 * Business logic for nutrition/meal-related operations
 */
const { Meal } = require('../models');
const { ApiError } = require('../utils/errors');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

/**
 * Create a new meal entry
 * @param {Object} mealData - Meal data
 * @returns {Object} Created meal
 */
exports.createMeal = async (mealData) => {
  const meal = await Meal.create(mealData);
  return meal;
};

/**
 * Get all meals for a user
 * @param {string} userId - User ID
 * @returns {Array} List of meals
 */
exports.getMealsByUserId = async (userId) => {
  const meals = await Meal.findAll({
    where: { UserId: userId },
    order: [['date', 'DESC']]
  });
  
  return meals;
};

/**
 * Get a specific meal by ID
 * @param {string} mealId - Meal ID
 * @param {string} userId - User ID
 * @returns {Object} Meal data
 */
exports.getMealById = async (mealId) => {
  const meal = await Meal.findOne({
    where: { id: mealId}
  });
  
  if (!meal) {
    throw new ApiError(404, 'Meal not found');
  }
  
  return meal;
};

/**
 * Update a meal entry
 * @param {string} mealId - Meal ID
 * @param {string} userId - User ID
 * @param {Object} mealData - Updated meal data
 * @returns {Object} Updated meal
 */
exports.updateMeal = async (mealId, mealData) => {
  const meal = await Meal.findOne({
    where: { id: mealId}
  });
  
  if (!meal) {
    throw new ApiError(404, 'Meal not found');
  }
  
  await meal.update(mealData);
  return meal;
};

/**
 * Delete a meal entry
 * @param {string} mealId - Meal ID
 * @param {string} userId - User ID
 * @returns {boolean} Success status
 */
exports.deleteMeal = async (mealId) => {
  const meal = await Meal.findOne({
    where: { id: mealId }
  });
  
  if (!meal) {
    throw new ApiError(404, 'Meal not found');
  }
  
  await meal.destroy();
  return true;
};

/**
 * Get nutrition summary for a date range
 * @param {string} userId - User ID
 * @param {string} startDate - Start date (optional)
 * @param {string} endDate - End date (optional)
 * @returns {Object} Nutrition summary
 */
exports.getNutritionSummary = async (userId, startDate, endDate) => {
  // Build date filter
  const dateFilter = {};
  if (startDate) {
    dateFilter[Op.gte] = new Date(startDate);
  }
  if (endDate) {
    dateFilter[Op.lte] = new Date(endDate);
  }
  
  const whereClause = { UserId: userId };
  if (Object.keys(dateFilter).length > 0) {
    whereClause.date = dateFilter;
  }
  
  // Get all meals in date range
  const meals = await Meal.findAll({
    where: whereClause,
    order: [['date', 'ASC']],
    attributes: [
      'date',
      'mealType',
      'calories',
      'protein',
      'carbs',
      'fat',
      [sequelize.fn('DATE', sequelize.col('date')), 'dateOnly']
    ]
  });
  
  // Group meals by day for daily breakdown
  const mealsByDay = meals.reduce((acc, meal) => {
    const dateKey = meal.getDataValue('dateOnly');
    
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        mealCount: 0
      };
    }
    
    acc[dateKey].totalCalories += meal.calories || 0;
    acc[dateKey].totalProtein += meal.protein || 0;
    acc[dateKey].totalCarbs += meal.carbs || 0;
    acc[dateKey].totalFat += meal.fat || 0;
    acc[dateKey].mealCount += 1;
    
    return acc;
  }, {});
  
  // Calculate summary statistics
  const dailyBreakdown = Object.values(mealsByDay);
  const totalDays = dailyBreakdown.length;
  
  const summaryStats = dailyBreakdown.reduce(
    (summary, day) => {
      summary.totalCalories += day.totalCalories;
      summary.totalProtein += day.totalProtein;
      summary.totalCarbs += day.totalCarbs;
      summary.totalFat += day.totalFat;
      summary.totalMeals += day.mealCount;
      return summary;
    },
    {
      totalDays,
      totalMeals: 0,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0
    }
  );
  
  // Calculate daily averages
  if (totalDays > 0) {
    summaryStats.dailyAverageCalories = summaryStats.totalCalories / totalDays;
    summaryStats.dailyAverageProtein = summaryStats.totalProtein / totalDays;
    summaryStats.dailyAverageCarbs = summaryStats.totalCarbs / totalDays;
    summaryStats.dailyAverageFat = summaryStats.totalFat / totalDays;
  } else {
    summaryStats.dailyAverageCalories = 0;
    summaryStats.dailyAverageProtein = 0;
    summaryStats.dailyAverageCarbs = 0;
    summaryStats.dailyAverageFat = 0;
  }
  
  return {
    summary: summaryStats,
    dailyBreakdown
  };
};
