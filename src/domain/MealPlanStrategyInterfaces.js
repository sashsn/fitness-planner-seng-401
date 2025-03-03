/**
 * @file MealPlanStrategyInterfaces.js
 * @description Defines interfaces for the Meal Planning Strategy Pattern
 * 
 * This file contains interfaces that define the contract for different meal planning strategies.
 * Each concrete strategy will implement these interfaces to provide specific meal planning
 * algorithms for different dietary needs and preferences.
 */

/**
 * Interface for all meal planning strategies
 */
class MealPlanStrategy {
    /**
     * Generates a meal plan based on user requirements
     * @param {Object} userProfile - User's profile with dietary preferences and restrictions
     * @param {Object} nutritionGoals - Caloric and macronutrient targets
     * @returns {Object} Complete meal plan with daily meals and recipes
     */
    generateMealPlan(userProfile, nutritionGoals) {
      throw new Error("Method 'generateMealPlan' must be implemented by concrete strategies");
    }
  
    /**
     * Calculates appropriate portion sizes based on user's needs
     * @param {Object} userMetrics - User's weight, height, activity level
     * @param {Object} foodItem - Food item to calculate portions for
     * @returns {Object} Portion recommendations
     */
    calculatePortions(userMetrics, foodItem) {
      throw new Error("Method 'calculatePortions' must be implemented by concrete strategies");
    }
  }
  
  // Export the interface
  module.exports = {
    MealPlanStrategy
  };