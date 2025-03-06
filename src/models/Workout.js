/**
 * Workout model
 * Defines the workout schema for the application
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Workout = sequelize.define('Workout', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    duration: {
      type: DataTypes.INTEGER,  // Duration in minutes
      allowNull: true
    },
    caloriesBurned: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    workoutType: {
      type: DataTypes.ENUM('cardio', 'strength', 'flexibility', 'balance', 'other'),
      allowNull: false,
      defaultValue: 'other'
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true
  });

  return Workout;
};
