const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserTestResults = sequelize.define('UserTestResults', {
  result_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.STRING(100),
  },
  method: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  riasec_scores: {
    type: DataTypes.JSONB,
  },
  selected_skills: {
    type: DataTypes.JSONB,
  },
  selected_fields: {
    type: DataTypes.JSONB,
  },
  recommendations: {
    type: DataTypes.JSONB,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_test_results',
  timestamps: false,
});


module.exports = UserTestResults;
