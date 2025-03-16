'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log('Starting migration: adding intensity column to Workouts table');
      
      // Check if the Workouts table exists
      try {
        await queryInterface.describeTable('Workouts');
      } catch (error) {
        console.error('Workouts table does not exist:', error.message);
        return Promise.resolve();
      }
      
      // Get the current columns
      const tableInfo = await queryInterface.describeTable('Workouts');
      const columns = Object.keys(tableInfo);
      
      // Add intensity column if it doesn't exist
      if (!columns.includes('intensity')) {
        await queryInterface.addColumn('Workouts', 'intensity', {
          type: Sequelize.STRING,
          allowNull: true
        });
        console.log('Added intensity column to Workouts table');
      } else {
        console.log('intensity column already exists in Workouts table');
      }
      
      console.log('Migration completed successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Migration failed:', error);
      return Promise.reject(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove the intensity column if it exists
      const tableInfo = await queryInterface.describeTable('Workouts');
      
      if (tableInfo.intensity) {
        await queryInterface.removeColumn('Workouts', 'intensity');
        console.log('Removed intensity column from Workouts table');
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to rollback migration:', error);
      return Promise.reject(error);
    }
  }
};
