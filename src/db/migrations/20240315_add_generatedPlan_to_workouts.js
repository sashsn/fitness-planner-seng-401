'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if the column already exists to avoid errors
      const tableInfo = await queryInterface.describeTable('Workouts');
      
      // Only add the column if it doesn't exist
      if (!tableInfo.generatedPlan) {
        await queryInterface.addColumn('Workouts', 'generatedPlan', {
          type: Sequelize.TEXT,
          allowNull: true
        });
      }
      
      // Update workoutType ENUM to include 'AI Generated' if not already present
      try {
        await queryInterface.sequelize.query(`
          ALTER TYPE "enum_Workouts_workoutType" ADD VALUE IF NOT EXISTS 'AI Generated'
        `);
      } catch (error) {
        console.error('Error adding ENUM value:', error);
        // If the above fails, we'll try a different approach for older Postgres versions
        await queryInterface.changeColumn('Workouts', 'workoutType', {
          type: Sequelize.ENUM('cardio', 'strength', 'flexibility', 'balance', 'other', 'AI Generated'),
          allowNull: false,
          defaultValue: 'other'
        });
      }
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove the column
      await queryInterface.removeColumn('Workouts', 'generatedPlan');
      
      // We can't easily remove an ENUM value in PostgreSQL, so we'll leave it
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
