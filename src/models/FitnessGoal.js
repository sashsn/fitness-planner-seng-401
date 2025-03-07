/**
 * FitnessGoal model
 * Defines the fitness goal schema for the application
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FitnessGoal = sequelize.define('FitnessGoal', {
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
    goalType: {
      type: DataTypes.ENUM('weight', 'strength', 'endurance', 'nutrition', 'other'),
      allowNull: false
    },
    targetValue: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    currentValue: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    targetDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true
  });

  return FitnessGoal;
};
