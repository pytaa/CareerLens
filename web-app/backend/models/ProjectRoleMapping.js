const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const DummyProjects = require('./DummyProjects');
const MasterRoles = require('./MasterRoles');

const ProjectRoleMapping = sequelize.define('ProjectRoleMapping', {
  project_id: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: DummyProjects,
      key: 'project_id',
    },
  },
  role_id: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: MasterRoles,
      key: 'role_id',
    },
  },
}, {
  tableName: 'project_role_mapping',
  timestamps: false,
  primaryKey: false,
});

ProjectRoleMapping.belongsTo(DummyProjects, { foreignKey: 'project_id' });
ProjectRoleMapping.belongsTo(MasterRoles, { foreignKey: 'role_id' });

module.exports = ProjectRoleMapping;
