/**
 * Database setup script
 * Initializes the database and loads seed data
 */
const { initializeDatabase } = require('../db/init');
const { sequelize } = require('../models');
const logger = require('../utils/logger');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Run database migrations
 * @returns {Promise}
 */
async function runMigrations() {
  try {
    logger.info('Running database migrations...');
    await execPromise('npx sequelize-cli db:migrate');
    logger.info('Database migrations completed successfully');
    return true;
  } catch (error) {
    logger.error(`Migration failed: ${error.message}`);
    throw error;
  }
}

/**
 * Run database seeders
 * @returns {Promise}
 */
async function runSeeders() {
  try {
    logger.info('Running database seeders...');
    await execPromise('npx sequelize-cli db:seed:all');
    logger.info('Database seeding completed successfully');
    return true;
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    throw error;
  }
}

/**
 * Set up the database
 * @param {boolean} force - Whether to force reset the database
 */
async function setupDatabase(force = false) {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    
    if (force) {
      // Initialize database with force flag to drop existing tables
      await initializeDatabase(true);
    } else {
      // Run migrations
      await runMigrations();
    }
    
    // Run seeders
    await runSeeders();
    
    logger.info('Database setup completed successfully');
  } catch (error) {
    logger.error(`Database setup failed: ${error.message}`);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// If script is executed directly, setup database
if (require.main === module) {
  const force = process.argv.includes('--force');
  setupDatabase(force)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { setupDatabase };
