const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserTestResults = sequelize.define('UserTestResults', {
  result_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_session_id: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  riasec_scores: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  selected_skills: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  selected_fields: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  recommended_roles: {
    type: DataTypes.JSON,
    allowNull: true,
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
