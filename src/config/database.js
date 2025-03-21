/**
 * Database Configuration
 * Sets up database connection and ensures models are synchronized
 */

const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Get database configuration from environment
const {
  DB_HOST = 'postgresql://fitness_planner_user:IsT5aUjh1kJd4HM9IXgxNf01A0CXayZA@dpg-cvefprd2ng1s73cftkug-a/fitness_planner',
  DB_PORT = 5432,
  DB_NAME = 'fitness_planner',
  DB_USER = 'fitness_planner_user',
  DB_PASSWORD = 'IsT5aUjh1kJd4HM9IXgxNf01A0CXayZA',
  DB_DIALECT = 'postgres'
} = process.env;

// Create Sequelize instance with connection pooling
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: DB_DIALECT,
  host: DB_HOST,
  port: DB_PORT,
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Define DB object and register models
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
// Correct way to import and initialize models
db.User = require('../models/User')(sequelize, Sequelize.DataTypes);
db.Workout = require('../models/Workout')(sequelize);
db.Exercise = require('../models/Exercise')(sequelize, Sequelize.DataTypes);
db.FitnessGoal = require('../models/FitnessGoal')(sequelize);
db.Meal = require('../models/meal')(sequelize, Sequelize.DataTypes);
db.Nutrition = require('../models/Nutrition')(sequelize);
db.FitnessPlan = require('../models/FitnessPlan')(sequelize, Sequelize.DataTypes); // new model

// Setup Associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Function to connect to the database and sync models
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL database connection established successfully');

    // Sync all models, ensuring structure is up-to-date
    console.log("Syncing database models...");
    await sequelize.sync({ alter: true });

    logger.info('Database models synchronized successfully');
    return sequelize;
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    return false;
  }
};

module.exports = { sequelize, connectDB, ...db };
