const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DummyProjects = sequelize.define('DummyProjects', {
  project_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  judul_project: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  brief_case: {
    type: DataTypes.TEXT,
  },
  instructions: {
    type: DataTypes.TEXT,
  },
  tools_used: {
    type: DataTypes.TEXT,
  },

}, {
  tableName: 'dummy_projects',
  timestamps: false,
});

module.exports = DummyProjects;
