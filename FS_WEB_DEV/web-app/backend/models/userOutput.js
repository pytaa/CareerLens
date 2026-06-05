const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('UserOutput', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    output_type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    output_value: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    context: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'user_outputs',
    timestamps: false,
  });
};
