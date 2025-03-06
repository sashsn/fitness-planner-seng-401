const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
const env = require('./env');

// Use the same Sequelize instance from models/index.js
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: 'postgres', // Hardcoded as requested
  password: 'root',     // Hardcoded as requested
  database: 'fitness_planner', // Match exactly the database name from psql output
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL database connection established successfully');
    
    // Force sync to recreate tables with relaxed structure
    // CAUTION: This will drop existing tables and recreate them
    const syncOption = { force: true, alter: true };
    await sequelize.sync(syncOption);
    logger.info('Database models synchronized with relaxed validation');
    
    return sequelize;
  } catch (error) {
    logger.error(`Error connecting to PostgreSQL database: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
