// controllers/fitnessPlanController.js
const { FitnessPlan } = require('../models');
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Save a new fitness plan entry for the authenticated user.
 * Expects the plan details to be in req.body.planDetails.
 * Assumes req.user is available (or use req.body.userId for testing).
 */
exports.saveFitnessPlan = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      throw new ApiError(400, 'User id is required');
    }
    const planDetails = req.body.planDetails;
    if (!planDetails) {
      throw new ApiError(400, 'Plan details are required');
    }

    const newPlan = await FitnessPlan.create({ userId, planDetails });
    res.status(201).json(newPlan);
  } catch (error) {
    logger.error('Error saving fitness plan: ' + error.message);
    next(error);
  }
};

/**
 * Retrieve all stored fitness plans for the authenticated user.
 * Expects req.user to contain the authenticated user's id or a userId query parameter.
 */
exports.getFitnessPlans = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw new ApiError(400, 'User id is required');
    }
    const plans = await FitnessPlan.findAll({ where: { userId } });
    res.status(200).json(plans);
  } catch (error) {
    logger.error('Error retrieving fitness plans: ' + error.message);
    next(error);
  }
};

/**
 * Delete a fitness plan based on its id.
 * Expects the plan id to be passed as a route parameter.
 */
exports.deleteFitnessPlan = async (req, res, next) => {
  try {
    const planId = req.params.id;
    if (!planId) {
      throw new ApiError(400, 'Plan id is required');
    }
    // Optionally: Verify the plan belongs to the authenticated user.
    const deleted = await FitnessPlan.destroy({ where: { id: planId } });
    if (deleted) {
      res.status(200).json({ message: 'Plan deleted successfully' });
    } else {
      res.status(404).json({ message: 'Plan not found' });
    }
  } catch (error) {
    logger.error('Error deleting fitness plan: ' + error.message);
    next(error);
  }
};


// Add this function in fitnessPlanController.js
exports.getFitnessPlanById = async (req, res, next) => {
    try {
      const planId = req.params.id;
      // Assuming you have authentication middleware that sets req.user
      if (!planId) {
        throw new ApiError(400, 'Plan id is required');
      }
      
      const plan = await FitnessPlan.findOne({
        where: { id: planId }
      });
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      res.status(200).json(plan);
    } catch (error) {
      logger.error('Error retrieving fitness plan by id: ' + error.message);
      next(error);
    }
  };
  
