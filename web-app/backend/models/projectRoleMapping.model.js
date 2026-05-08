const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectRoleMapping = sequelize.define('ProjectRoleMapping', {
  project_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  role_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
}, {
  tableName: 'project_role_mapping',
  timestamps: false,
});

module.exports = ProjectRoleMapping;
