/**
 * Database models initialization
 * Sets up Sequelize and connects all models
 */
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const logger = require('../utils/logger');
const env = require('../config/env');

// Configure PostgreSQL connection
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: env.DB_HOST || 'localhost',
  port: env.DB_PORT || 5432,
  username: 'postgres', // Hardcoded as requested
  password: 'Sql000',     // Hardcoded as requested
  database: 'fitness_planner', // Match exactly the database name from psql output
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const db = {};

// Read all model files and import them
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && 
           (file !== 'index.js') && 
           (file.slice(-3) === '.js');
  })
  .forEach(file => {
    try {
      // Pass both sequelize instance and DataTypes to model initializer
      const model = require(path.join(__dirname, file))(sequelize, DataTypes);
      db[model.name] = model;
    } catch (error) {
      logger.error(`Error loading model ${file}: ${error.message}`);
    }
  });

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
