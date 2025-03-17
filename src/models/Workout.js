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
      type: DataTypes.ENUM('cardio', 'strength', 'flexibility', 'balance', 'other', 'AI Generated'),
      allowNull: false,
      defaultValue: 'other'
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // Add generatedPlan field to store AI-generated workout plans
    generatedPlan: {
      type: DataTypes.TEXT,  // Using TEXT to store JSON string
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('generatedPlan');
        if (rawValue) {
          try {
            return JSON.parse(rawValue);
          } catch (error) {
            return rawValue;
          }
        }
        return null;
      },
      set(value) {
        if (value) {
          this.setDataValue('generatedPlan', 
            typeof value === 'string' ? value : JSON.stringify(value)
          );
        } else {
          this.setDataValue('generatedPlan', null);
        }
      }
    },
    intensity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  // Define associations in the model associate method
  Workout.associate = (models) => {
    Workout.belongsTo(models.User);
    Workout.hasMany(models.Exercise, {
      onDelete: 'CASCADE'
    });
  };

  return Workout;
};
