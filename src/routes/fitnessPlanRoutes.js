// routes/fitnessPlanRoutes.js
const express = require('express');
const fitnessPlanController = require('../controllers/fitnessPlanController');

const router = express.Router();

/**
 * Route to save a new fitness plan.
 * POST /api/fitness-plans
 */
router.post('/', fitnessPlanController.saveFitnessPlan);

/**
 * Route to retrieve all fitness plans for a user.
 * GET /api/fitness-plans?userId=xxx
 */
router.get('/:userId', fitnessPlanController.getFitnessPlans);

/**
 * Route to delete a specific fitness plan by its id.
 * DELETE /api/fitness-plans/:id
 */
router.delete('/:id', fitnessPlanController.deleteFitnessPlan);


// In fitnessPlanRoutes.js, add the following route
router.get('/getPlanById/:id', fitnessPlanController.getFitnessPlanById);

module.exports = router;
