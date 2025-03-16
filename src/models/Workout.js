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
      allowNull: false,
      // Add index for faster search by name
      index: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      // Add index for sorting by date (common operation)
      index: true
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
      defaultValue: 'other',
      // Add index for filtering by type
      index: true
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      // Add index for filtering completed/incomplete workouts
      index: true
    },
    // Optimize generatedPlan field for better JSON handling
    generatedPlan: {
      type: DataTypes.TEXT,  // Using TEXT to store JSON string
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('generatedPlan');
        if (rawValue) {
          try {
            // Parse JSON only when accessed
            return JSON.parse(rawValue);
          } catch (error) {
            console.error('Error parsing generatedPlan:', error);
            return rawValue;
          }
        }
        return null;
      },
      set(value) {
        if (value) {
          // Compress large plans before storing (for better DB performance)
          let valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
          
          // Add basic sanity checks to avoid corrupted data
          try {
            // Test if we can parse it
            const test = (typeof value === 'string') ? JSON.parse(value) : value;
            if (!test || typeof test !== 'object') {
              throw new Error('Invalid plan format');
            }
          } catch (error) {
            console.error('Invalid workout plan format:', error);
            valueToStore = JSON.stringify({ error: 'Invalid plan format' });
          }
          
          this.setDataValue('generatedPlan', valueToStore);
        } else {
          this.setDataValue('generatedPlan', null);
        }
      }
    },
    intensity: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'medium',
      validate: {
        isIn: {
          args: [['low', 'medium', 'high']],
          msg: "Intensity must be 'low', 'medium', or 'high'"
        }
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    // Add indexes for common query patterns
    indexes: [
      {
        name: 'workout_user_date_idx',
        fields: ['UserId', 'date'], // Compound index for user's workouts by date
      },
      {
        name: 'workout_type_user_idx',
        fields: ['workoutType', 'UserId'], // Compound index for filtering by type
      }
    ]
  });

  // Define associations in the model associate method
  Workout.associate = (models) => {
    Workout.belongsTo(models.User, {
      foreignKey: {
        name: 'UserId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
    
    Workout.hasMany(models.Exercise, {
      foreignKey: {
        name: 'WorkoutId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };

  return Workout;
};
