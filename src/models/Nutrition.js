/**
 * Nutrition model
 * Defines the nutrition/meal schema for the application
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Nutrition = sequelize.define('Nutrition', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    mealType: {
      type: DataTypes.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
      allowNull: false
    },
    calories: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    protein: {
      type: DataTypes.FLOAT,  // in grams
      allowNull: true
    },
    carbs: {
      type: DataTypes.FLOAT,  // in grams
      allowNull: true
    },
    fat: {
      type: DataTypes.FLOAT,  // in grams
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  return Nutrition;
};
