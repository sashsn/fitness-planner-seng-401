/**
 * Test setup file
 * Configures the test environment
 */
const { sequelize } = require('../models');
const logger = require('../utils/logger');

/**
 * Setup function to be run before tests
 */
async function setupTestDb() {
  try {
    // Sync database with force flag to recreate tables
    await sequelize.sync({ force: true });
    logger.info('Test database synced successfully');
  } catch (error) {
    logger.error(`Error setting up test database: ${error.message}`);
    throw error;
  }
}

/**
 * Cleanup function to be run after tests
 */
async function teardownTestDb() {
  try {
    await sequelize.close();
    logger.info('Test database connection closed successfully');
  } catch (error) {
    logger.error(`Error closing test database connection: ${error.message}`);
    throw error;
  }
}

module.exports = {
  setupTestDb,
  teardownTestDb
};
