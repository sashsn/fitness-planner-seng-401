/**
 * Run Missing Columns Migration
 * 
 * This script runs the migration to add missing columns to the Workouts table
 */
const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
require('dotenv').config();

// Get database configuration from environment
const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_NAME = 'fitness_planner',
  DB_USER = 'postgres',
  DB_PASSWORD = 'root',
  DB_DIALECT = 'postgres'
} = process.env;

console.log("Running missing columns migration...");

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

// Path to migration file
const migrationPath = path.join(__dirname, '../db/migrations/20240316_add_missing_workout_columns.js');

async function runMigration() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Connection established successfully.');
    
    // Verify migration file exists
    if (!fs.existsSync(migrationPath)) {
      console.error('Migration file not found:', migrationPath);
      process.exit(1);
    }
    
    // Import and run migration
    const migration = require(migrationPath);
    await migration.up(sequelize.getQueryInterface(), Sequelize);
    
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
runMigration();
