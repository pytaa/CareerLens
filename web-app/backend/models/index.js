const sequelize = require('../config/database');
const Fields = require('./field.model');
const Roles = require('./role.model');
const MasterRoles = require('./masterRole.model');
const LearningResources = require('./learningResource.model');
const DummyProjects = require('./dummyProject.model');
const ProjectRoleMapping = require('./projectRoleMapping.model');
const UserTestResults = require('./userTestResult.model');

const TestQuestions = require('./testQuestion.model');

Fields.hasMany(Roles, { foreignKey: 'field_id' });
Roles.belongsTo(Fields, { foreignKey: 'field_id' });

Fields.hasMany(MasterRoles, { foreignKey: 'field_id' });
MasterRoles.belongsTo(Fields, { foreignKey: 'field_id' });

MasterRoles.hasMany(LearningResources, { foreignKey: 'role_id' });
LearningResources.belongsTo(MasterRoles, { foreignKey: 'role_id' });

MasterRoles.belongsToMany(DummyProjects, {
  through: ProjectRoleMapping,
  foreignKey: 'role_id',
  otherKey: 'project_id',
});
DummyProjects.belongsToMany(MasterRoles, {
  through: ProjectRoleMapping,
  foreignKey: 'project_id',
  otherKey: 'role_id',
});

Roles.hasOne(MasterRoles, { foreignKey: 'role_id', sourceKey: 'role_id' });
MasterRoles.belongsTo(Roles, { foreignKey: 'role_id', targetKey: 'role_id' });

module.exports = {
  sequelize,
  Fields,
  Roles,
  MasterRoles,
  LearningResources,
  DummyProjects,
  ProjectRoleMapping,
  UserTestResults,
  TestQuestions,
};

