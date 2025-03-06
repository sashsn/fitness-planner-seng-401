const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Meal extends Model {
    static associate(models) {
      Meal.belongsTo(models.User, { foreignKey: 'UserId' });
    }
  }

  Meal.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
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
      type: DataTypes.FLOAT,
      allowNull: true
    },
    carbs: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    fat: {
      type: DataTypes.FLOAT,
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
    sequelize,
    modelName: 'Meal',
  });

  return Meal;
};
