/**
 * Database Configuration
 * Sets up database connection
 */
const { Sequelize } = require('sequelize');
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
    // For testing purposes, just authenticate without syncing models
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    return false;
  }
};

// Create empty placeholder models for now
db.User = { findByPk: () => Promise.resolve({ id: 'test-user', username: 'test' }) };
db.Workout = { count: () => Promise.resolve(0) };
db.Exercise = {};

module.exports = { sequelize, connectDB, ...db };
