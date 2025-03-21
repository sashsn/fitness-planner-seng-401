

module.exports = (sequelize, DataTypes) => {
    const FitnessPlan = sequelize.define('FitnessPlan', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      // Foreign key to associate the plan with a user
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      // Store the plan details as a JSONB object for easy retrieval and parsing
      planDetails: {
        type: DataTypes.JSONB,
        allowNull: false
      }
    }, {
        sequelize,
        modelName: 'Exercise',
        timestamps: true
      });
  
    FitnessPlan.associate = (models) => {
      // A fitness plan belongs to a User.
      FitnessPlan.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    };
  
    return FitnessPlan;
  };
  