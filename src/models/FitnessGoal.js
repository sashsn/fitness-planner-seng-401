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
      type: DataTypes.ENUM('weight', 'strength', 'endurance', 'nutrition', 'flexibility', 'mental', 'other'),
      allowNull: false
    },
    targetValue: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    currentValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
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
    },
    progressHistory: {
      type: DataTypes.TEXT, // Store progress over time as a JSON string
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('progressHistory');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('progressHistory', JSON.stringify(value));
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  // Define associations in the model associate method
  FitnessGoal.associate = (models) => {
    FitnessGoal.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };

  return FitnessGoal;
};
