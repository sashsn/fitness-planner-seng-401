/**
 * Goal Controller
 * Handles fitness goal-related HTTP requests
 */
const goalService = require('../services/goalService');

/**
 * Create a new fitness goal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const goalData = { ...req.body, UserId: userId };
    const goal = await goalService.createGoal(goalData);
    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all fitness goals for the logged-in user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getUserGoals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const goals = await goalService.getGoalsByUserId(userId);
    res.status(200).json(goals);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific fitness goal by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getGoalById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const goal = await goalService.getGoalById(id, userId);
    res.status(200).json(goal);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a fitness goal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const goalData = req.body;
    const updatedGoal = await goalService.updateGoal(id, userId, goalData);
    res.status(200).json(updatedGoal);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a fitness goal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await goalService.deleteGoal(id, userId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

/**
 * Track progress for a specific fitness goal
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.trackGoalProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { currentValue } = req.body;
    const progress = await goalService.updateGoalProgress(id, userId, currentValue);
    res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
};
