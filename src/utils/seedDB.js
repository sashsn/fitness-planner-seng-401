/**
 * Database seeder utility
 * Creates test users for development and testing
 */
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const logger = require('./logger');

/**
 * Seed the database with test users
 */
const seedUsers = async () => {
  try {
    logger.info('Starting database seeding...');
    
    // Hash password for test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Create test user if it doesn't exist
    const [user, created] = await User.findOrCreate({
      where: { email: 'john@doe.com' },
      defaults: {
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        password: hashedPassword,
        role: 'user',
        dateOfBirth: new Date('1990-01-01')
      }
    });
    
    if (created) {
      logger.info('Test user created successfully');
      logger.debug(`Test user details: ID=${user.id}, username=${user.username}, email=${user.email}`);
    } else {
      logger.info('Test user already exists');
    }
    
    logger.info('Database seeding completed');
  } catch (error) {
    logger.error('Error seeding database:', error);
  }
};

module.exports = {
  seedUsers
};
