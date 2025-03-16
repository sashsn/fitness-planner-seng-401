'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log('Starting migration: add generatedPlan column to Workouts table');
      
      // Check if the table exists
      try {
        await queryInterface.describeTable('Workouts');
      } catch (error) {
        console.error('Workouts table does not exist:', error.message);
        console.log('Creating Workouts table...');
        
        // Create the table if it doesn't exist
        await queryInterface.createTable('Workouts', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
          },
          duration: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          caloriesBurned: {
            type: Sequelize.FLOAT,
            allowNull: true
          },
          workoutType: {
            type: Sequelize.STRING, // Use STRING instead of ENUM for flexibility
            allowNull: false,
            defaultValue: 'other'
          },
          isCompleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          intensity: {
            type: Sequelize.STRING,
            allowNull: true
          },
          notes: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          UserId: {
            type: Sequelize.UUID,
            references: {
              model: 'Users',
              key: 'id'
            },
            allowNull: true // Allow null for development testing
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          }
        });
        console.log('Workouts table created');
      }
      
      // Check if the column already exists to avoid errors
      const tableInfo = await queryInterface.describeTable('Workouts');
      
      // Only add the column if it doesn't exist
      if (!tableInfo.generatedPlan) {
        console.log('Adding generatedPlan column...');
        await queryInterface.addColumn('Workouts', 'generatedPlan', {
          type: Sequelize.TEXT,
          allowNull: true
        });
        console.log('generatedPlan column added');
      } else {
        console.log('generatedPlan column already exists');
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
      // Only try removing the column if the table exists
      try {
        await queryInterface.describeTable('Workouts');
        // Remove the column if the table exists
        await queryInterface.removeColumn('Workouts', 'generatedPlan');
      } catch (error) {
        console.error('Failed to remove column - table may not exist:', error.message);
      }
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
};
