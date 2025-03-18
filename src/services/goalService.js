/**
 * Goal Service
 * Business logic for fitness goal-related operations
 */
const { FitnessGoal } = require('../models');
const { ApiError } = require('../utils/errors');

/**
 * Create a new fitness goal
 * @param {Object} goalData - Goal data
 * @returns {Object} Created goal
 */
exports.createGoal = async (goalData) => {
  console.log("in creatGoal in goalService");
  const goal = await FitnessGoal.create(goalData);

  console.log("created goal = ", goal)

  return goal;
};

/**
 * Get all fitness goals for a user
 * @param {string} userId - User ID
 * @returns {Array} List of goals
 */
exports.getGoalsByUserId = async (userId) => {
  const goals = await FitnessGoal.findAll({
    where: { UserId: userId },
    order: [['createdAt', 'DESC']]
  });
  
  return goals;
};

/**
 * Get a specific fitness goal by ID
 * @param {string} goalId - Goal ID
 * @param {string} userId - User ID
 * @returns {Object} Goal data
 */
exports.getGoalById = async (goalId, userId) => {
  const goal = await FitnessGoal.findOne({
    where: { id: goalId, UserId: userId }
  });
  
  if (!goal) {
    throw new ApiError(404, 'Fitness goal not found');
  }
  
  return goal;
};

/**
 * Update a fitness goal
 * @param {string} goalId - Goal ID
 * @param {string} userId - User ID
 * @param {Object} goalData - Updated goal data
 * @returns {Object} Updated goal
 */
exports.updateGoal = async (goalId, userId, goalData) => {
  const goal = await FitnessGoal.findOne({
    where: { id: goalId, UserId: userId }
  });
  
  if (!goal) {
    throw new ApiError(404, 'Fitness goal not found');
  }
  
  await goal.update(goalData);
  return goal;
};

/**
 * Delete a fitness goal
 * @param {string} goalId - Goal ID
 * @param {string} userId - User ID
 * @returns {boolean} Success status
 */
exports.deleteGoal = async (goalId, userId) => {
  const goal = await FitnessGoal.findOne({
    where: { id: goalId, UserId: userId }
  });
  
  if (!goal) {
    throw new ApiError(404, 'Fitness goal not found');
  }
  
  await goal.destroy();
  return true;
};

/**
 * Update goal progress
 * @param {string} goalId - Goal ID
 * @param {string} userId - User ID
 * @param {number} currentValue - Current value
 * @returns {Object} Updated goal with progress info
 */
exports.updateGoalProgress = async (goalId, userId, currentValue) => {
  const goal = await FitnessGoal.findOne({
    where: { id: goalId, UserId: userId }
  });
  
  if (!goal) {
    throw new ApiError(404, 'Fitness goal not found');
  }
  
  // Check if goal is completed based on goal type and values
  let isCompleted = false;
  if (goal.goalType === 'weight') {
    if ((goal.targetValue < goal.currentValue && currentValue <= goal.targetValue) || 
        (goal.targetValue > goal.currentValue && currentValue >= goal.targetValue)) {
      isCompleted = true;
    }
  } else {
    // For other goal types, simple comparison
    if ((goal.targetValue < goal.currentValue && currentValue <= goal.targetValue) || 
        (goal.targetValue > goal.currentValue && currentValue >= goal.targetValue)) {
      isCompleted = true;
    }
  }
  
  // Update the goal with new values
  await goal.update({
    currentValue,
    isCompleted
  });
  
  // Calculate progress percentage
  const initialDifference = Math.abs(goal.targetValue - goal.startValue || 0);
  const currentDifference = Math.abs(goal.targetValue - currentValue);
  let progressPercentage = 0;
  
  if (initialDifference > 0) {
    progressPercentage = ((initialDifference - currentDifference) / initialDifference) * 100;
    progressPercentage = Math.max(0, Math.min(100, progressPercentage));
  }
  
  return {
    ...goal.toJSON(),
    progressPercentage,
    remainingDays: goal.targetDate ? 
      Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)) : 
      null
  };
};
