const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('RecommendationEvent', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    method: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    request_payload: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    response_payload: {
      type: DataTypes.JSONB,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'recommendation_events',
    timestamps: false,
  });
};
