/**
 * Seed file for sample workouts
 */
const { v4: uuidv4 } = require('uuid');

module.exports = {
  /**
   * Add seed data
   * @param {Object} queryInterface - Sequelize QueryInterface
   * @param {Object} Sequelize - Sequelize instance
   * @returns {Promise}
   */
  up: async (queryInterface, Sequelize) => {
    // Get user IDs
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM "Users";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    if (!users.length) {
      return Promise.resolve();
    }
    
    const userId = users[0].id;
    
    // Create some sample workouts
    const workoutId1 = uuidv4();
    const workoutId2 = uuidv4();
    
    await queryInterface.bulkInsert('Workouts', [
      {
        id: workoutId1,
        UserId: userId,
        name: 'Morning Cardio',
        description: 'Quick morning cardio session',
        date: new Date(),
        duration: 30,
        caloriesBurned: 250,
        workoutType: 'cardio',
        isCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: workoutId2,
        UserId: userId,
        name: 'Evening Strength Training',
        description: 'Full body workout focusing on major muscle groups',
        date: new Date(),
        duration: 45,
        caloriesBurned: 350,
        workoutType: 'strength',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Add exercises to workouts
    return queryInterface.bulkInsert('Exercises', [
      {
        id: uuidv4(),
        WorkoutId: workoutId1,
        name: 'Treadmill Run',
        description: 'Steady pace run',
        duration: 1800,
        distance: 5.0,
        notes: 'Felt good, maintained steady pace',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        WorkoutId: workoutId2,
        name: 'Bench Press',
        description: 'Flat bench press with barbell',
        sets: 3,
        reps: 10,
        weight: 60,
        restTime: 90,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        WorkoutId: workoutId2,
        name: 'Squats',
        description: 'Barbell squats',
        sets: 3,
        reps: 12,
        weight: 80,
        restTime: 120,
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
    await queryInterface.bulkDelete('Exercises', null, {});
    return queryInterface.bulkDelete('Workouts', null, {});
  }
};
