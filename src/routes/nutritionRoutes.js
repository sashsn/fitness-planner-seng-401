/**
 * Nutrition Routes
 * Handles nutrition management endpoints
 */
const express = require('express');
const nutritionController = require('../controllers/nutritionController');
const { auth } = require('../middleware/auth');
const { validateMeal } = require('../middleware/validation');

const router = express.Router();

// Basic placeholder route
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Nutrition endpoint placeholder' });
});

/**
 * @route POST /api/nutrition/meals
 * @description Create a new meal entry
 * @access Private
 */
router.post('/meals', auth, validateMeal, nutritionController.createMeal);

/**
 * @route GET /api/nutrition/meals
 * @description Get all meal entries for the logged-in user
 * @access Private
 */
router.get('/meals', auth, nutritionController.getUserMeals);

/**
 * @route GET /api/nutrition/meals/:id
 * @description Get a specific meal entry by ID
 * @access Private
 */
router.get('/meals/:id', auth, nutritionController.getMealById);

/**
 * @route PUT /api/nutrition/meals/:id
 * @description Update a meal entry
 * @access Private
 */
router.put('/meals/:id', auth, validateMeal, nutritionController.updateMeal);

/**
 * @route DELETE /api/nutrition/meals/:id
 * @description Delete a meal entry
 * @access Private
 */
router.delete('/meals/:id', auth, nutritionController.deleteMeal);

/**
 * @route GET /api/nutrition/summary
 * @description Get nutrition summary for a specific date range
 * @access Private
 */
router.get('/summary', auth, nutritionController.getNutritionSummary);

module.exports = router;
