/**
 * Seed file for demo users
 */
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  /**
   * Add seed data
   * @param {Object} queryInterface - Sequelize QueryInterface
   * @param {Object} Sequelize - Sequelize instance
   * @returns {Promise}
   */
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    return queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        username: 'demo_user',
        email: 'demo@example.com',
        password: password,
        firstName: 'Demo',
        lastName: 'User',
        dateOfBirth: new Date('1990-01-01'),
        height: 175,
        weight: 70,
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        username: 'admin_user',
        email: 'admin@example.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  /**
   * Remove seed data
   * @param {Object} queryInterface - Sequelize QueryInterface
   * @param {Object} Sequelize - Sequelize instance
   * @returns {Promise}
   */
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
