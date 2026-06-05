const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('TestResult', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    test_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    test_payload: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    result_payload: {
      type: DataTypes.JSONB,
    },
    score: {
      type: DataTypes.NUMERIC,
    },
    passed: {
      type: DataTypes.BOOLEAN,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'test_results',
    timestamps: false,
  });
};
