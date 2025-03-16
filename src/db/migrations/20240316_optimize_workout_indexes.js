'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log('Starting migration: adding performance indexes for workouts table');
      
      // Check if the Workouts table exists
      try {
        await queryInterface.describeTable('Workouts');
      } catch (error) {
        console.error('Workouts table does not exist:', error.message);
        return Promise.resolve();
      }
      
      // Add index for workout name (for search functionality)
      await queryInterface.addIndex('Workouts', ['name'], {
        name: 'workouts_name_idx'
      });
      console.log('Added index for name column');
      
      // Add index for date (for sorting)
      await queryInterface.addIndex('Workouts', ['date'], {
        name: 'workouts_date_idx'
      });
      console.log('Added index for date column');
      
      // Add compound index for user's workouts by date (common query pattern)
      await queryInterface.addIndex('Workouts', ['UserId', 'date'], {
        name: 'workouts_user_date_idx'
      });
      console.log('Added compound index for UserId and date');
      
      // Add index for workoutType (for filtering)
      await queryInterface.addIndex('Workouts', ['workoutType'], {
        name: 'workouts_type_idx'
      });
      console.log('Added index for workoutType column');
      
      // Add compound index for filtered user workouts by type
      await queryInterface.addIndex('Workouts', ['workoutType', 'UserId'], {
        name: 'workouts_type_user_idx'
      });
      console.log('Added compound index for workoutType and UserId');
      
      // Add index for isCompleted (for filtering)
      await queryInterface.addIndex('Workouts', ['isCompleted'], {
        name: 'workouts_completed_idx'
      });
      console.log('Added index for isCompleted column');
      
      console.log('Migration completed successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Migration failed:', error);
      return Promise.reject(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove all the indexes we created
      await queryInterface.removeIndex('Workouts', 'workouts_name_idx');
      await queryInterface.removeIndex('Workouts', 'workouts_date_idx');
      await queryInterface.removeIndex('Workouts', 'workouts_user_date_idx');
      await queryInterface.removeIndex('Workouts', 'workouts_type_idx');
      await queryInterface.removeIndex('Workouts', 'workouts_type_user_idx');
      await queryInterface.removeIndex('Workouts', 'workouts_completed_idx');
      
      console.log('Successfully removed all workout indexes');
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to rollback migration:', error.message);
      return Promise.reject(error);
    }
  }
};
