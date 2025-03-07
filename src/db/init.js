/**
 * Database initialization script
 * Creates database tables based on Sequelize models
 */
const { sequelize } = require('../models');
const logger = require('../utils/logger');

/**
 * Initialize database schema
 * @param {boolean} force - Whether to drop tables before creating them
 */
async function initializeDatabase(force = false) {
  try {
    logger.info('Initializing database...');
    await sequelize.sync({ force });
    logger.info('Database initialization completed successfully');
    return true;
  } catch (error) {
    logger.error(`Database initialization failed: ${error.message}`);
    throw error;
  }
}

// If script is executed directly, initialize database
if (require.main === module) {
  const force = process.argv.includes('--force');
  initializeDatabase(force)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { initializeDatabase };
