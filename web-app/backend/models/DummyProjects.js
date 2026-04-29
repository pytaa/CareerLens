const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DummyProjects = sequelize.define('DummyProjects', {
  project_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  judul_project: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  brief_case: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tools_used: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'dummy_projects',
  timestamps: false,
});

module.exports = DummyProjects;
