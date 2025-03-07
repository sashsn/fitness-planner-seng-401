/**
 * Exercise model
 * Defines the exercise schema for workouts
 */
module.exports = (sequelize, DataTypes) => {
  const Exercise = sequelize.define('Exercise', {
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
    muscleGroup: {
      type: DataTypes.STRING,
      allowNull: true
    },
    difficulty: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      defaultValue: 'intermediate'
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sets: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reps: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER, // in seconds
      allowNull: true
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    restTime: {
      type: DataTypes.INTEGER, // in seconds
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Exercise',
    timestamps: true
  });

  Exercise.associate = (models) => {
    Exercise.belongsToMany(models.Workout, {
      through: 'WorkoutExercises',
      foreignKey: 'exerciseId'
    });
  };

  return Exercise;
};
