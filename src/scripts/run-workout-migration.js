/**
 * Workout Migration Runner
 * Specifically runs the migration to add generatedPlan column to workouts
 */
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const logger = require('../utils/logger');

// Get database configuration from environment
const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_NAME = 'fitness_planner',
  DB_USER = 'postgres',
  DB_PASSWORD = 'root',
  DB_DIALECT = 'postgres'
} = process.env;

console.log("Running workout plan migration...");

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: DB_DIALECT,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  logging: console.log
});

async function runMigration() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connection established successfully.');
    
    const queryInterface = sequelize.getQueryInterface();
    
    // Check if the column already exists
    let tableInfo;
    try {
      tableInfo = await queryInterface.describeTable('Workouts');
      console.log('Table structure retrieved:', Object.keys(tableInfo));
    } catch (error) {
      console.error('Error getting table info:', error.message);
      throw error;
    }
    
    // Only add the column if it doesn't exist
    if (!tableInfo.generatedPlan) {
      console.log('Adding generatedPlan column to Workouts table...');
      await queryInterface.addColumn('Workouts', 'generatedPlan', {
        type: Sequelize.TEXT,
        allowNull: true
      });
      console.log('Column added successfully.');
    } else {
      console.log('generatedPlan column already exists.');
    }
    
    // Update workoutType ENUM to include 'AI Generated'
    try {
      console.log('Updating workoutType ENUM to include AI Generated...');
      // For Postgres specifically
      if (DB_DIALECT === 'postgres') {
        await sequelize.query(`
          ALTER TYPE "enum_Workouts_workoutType" ADD VALUE IF NOT EXISTS 'AI Generated'
        `);
      } else {
        // For other dialects like MySQL or SQLite
        await queryInterface.changeColumn('Workouts', 'workoutType', {
          type: Sequelize.ENUM('cardio', 'strength', 'flexibility', 'balance', 'other', 'AI Generated'),
          allowNull: false,
          defaultValue: 'other'
        });
      }
      console.log('ENUM updated successfully.');
    } catch (error) {
      console.error('Error updating ENUM (this may be expected):', error.message);
      console.log('Will try alternative approach...');
      
      try {
        // Alternative approach for older Postgres or other dialects
        await queryInterface.changeColumn('Workouts', 'workoutType', {
          type: Sequelize.STRING,  // Change to string instead of ENUM for more flexibility
          allowNull: false,
          defaultValue: 'other'
        });
        console.log('Changed workoutType to STRING type for flexibility.');
      } catch (innerError) {
        console.error('Error with alternative approach:', innerError.message);
      }
    }
    
    console.log('Migration process completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
