const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LearningResources = sequelize.define('LearningResources', {
  resource_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  role_id: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  step_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nama_skill: {
    type: DataTypes.STRING(255),
  },
  link_course: {
    type: DataTypes.TEXT,
  },
  tipe: {
    type: DataTypes.STRING(100),
  },
  platform: {
    type: DataTypes.STRING(100),
  },
}, {
  tableName: 'learning_resources',
  timestamps: false,
});

module.exports = LearningResources;
