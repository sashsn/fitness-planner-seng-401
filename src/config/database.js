/**
 * Database Configuration
 * Sets up database connection
 */
const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
const env = require('./env');
const db = require('../models'); // Import the models object


// Get database configuration from environment
const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_NAME = 'fitness_planner',
  DB_USER = 'postgres',
  DB_PASSWORD = 'root',
  DB_DIALECT = 'postgres'
} = process.env;

// Create Sequelize instance with connection pooling
const sequelize = new Sequelize({

  dialect: DB_DIALECT,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  logging: msg => logger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Basic models registry to avoid circular dependencies
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Function to connect to the database
const connectDB = async () => {
  try {
// this stuff was wokring for the updated db before most recent pull, keeping to ensure just in case - commented out what he had in commit
    await sequelize.authenticate();
    logger.info('PostgreSQL database connection established successfully');


    // Force sync to recreate tables with relaxed structure
    // CAUTION: This will drop existing tables and recreate them
    console.log("✅ Connected to database, syncing models...");
    console.log("Models in DB:", Object.keys(db));
    const syncOption = { force: true, alter: true };

    await db.sequelize.sync(syncOption);
    logger.info('Database models synchronized with relaxed validation');
    
    return db.sequelize;


    // // For testing purposes, just authenticate without syncing models
    // await sequelize.authenticate();
    // logger.info('Database connection established successfully');
    // return true;


  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    return false;
  }
};

// from before most recent pull
// module.exports = { sequelize: db.sequelize, connectDB };


// Create empty placeholder models for now
db.User = { findByPk: () => Promise.resolve({ id: 'test-user', username: 'test' }) };
db.Workout = { count: () => Promise.resolve(0) };
db.Exercise = {};

module.exports = { sequelize, connectDB, ...db };
