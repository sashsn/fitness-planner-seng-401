const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
const env = require('./env');
const db = require('../models'); // Import the models object


// Use the same Sequelize instance from models/index.js
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: 'postgres', // Hardcoded as requested
  password: 'O7frfuiq.',     // Hardcoded as requested - changed to 'O7frfuiq.' only for tetsing for me, ben
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
    console.log("✅ Connected to database, syncing models...");
    console.log("Models in DB:", Object.keys(db));
    const syncOption = { force: true, alter: true };

    await db.sequelize.sync(syncOption);
    logger.info('Database models synchronized with relaxed validation');
    
    return db.sequelize;
  } catch (error) {
    logger.error(`Error connecting to PostgreSQL database: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize: db.sequelize, connectDB };
