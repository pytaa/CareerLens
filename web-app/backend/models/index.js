const sequelize = require('../config/database');
const CareerFieldModel = require('./careerField');
const IndustryCategoryModel = require('./industryCategory');
const RoleModel = require('./role');
const SkillModel = require('./skill');
const RoleSkillModel = require('./roleSkill');
const LearningResourceModel = require('./learningResource');
const DummyProjectModel = require('./dummyProject');
const RoleProjectMappingModel = require('./roleProjectMapping');
const RecommendationEventModel = require('./recommendationEvent');
const UserModel = require('./user');
const UserEmailModel = require('./userEmail');
const TestResultModel = require('./testResult');
const UserOutputModel = require('./userOutput');

const CareerField = CareerFieldModel(sequelize);
const IndustryCategory = IndustryCategoryModel(sequelize);
const Role = RoleModel(sequelize);
const Skill = SkillModel(sequelize);
const RoleSkill = RoleSkillModel(sequelize);
const LearningResource = LearningResourceModel(sequelize);
const DummyProject = DummyProjectModel(sequelize);
const RoleProjectMapping = RoleProjectMappingModel(sequelize);
const RecommendationEvent = RecommendationEventModel(sequelize);
const User = UserModel(sequelize);
const UserEmail = UserEmailModel(sequelize);
const TestResult = TestResultModel(sequelize);
const UserOutput = UserOutputModel(sequelize);

CareerField.hasMany(IndustryCategory, { foreignKey: 'field_id', sourceKey: 'field_id' });
IndustryCategory.belongsTo(CareerField, { foreignKey: 'field_id', targetKey: 'field_id' });

CareerField.hasMany(Role, { foreignKey: 'field_id', sourceKey: 'field_id' });
Role.belongsTo(CareerField, { foreignKey: 'field_id', targetKey: 'field_id' });

Role.belongsToMany(Skill, { through: RoleSkill, foreignKey: 'role_id', otherKey: 'skill_id' });
Skill.belongsToMany(Role, { through: RoleSkill, foreignKey: 'skill_id', otherKey: 'role_id' });
Role.hasMany(RoleSkill, { foreignKey: 'role_id' });
Skill.hasMany(RoleSkill, { foreignKey: 'skill_id' });

Role.hasMany(LearningResource, { foreignKey: 'role_id' });
LearningResource.belongsTo(Role, { foreignKey: 'role_id' });

Role.hasMany(RoleProjectMapping, { foreignKey: 'role_id' });
RoleProjectMapping.belongsTo(Role, { foreignKey: 'role_id' });

DummyProject.hasMany(RoleProjectMapping, { foreignKey: 'project_id' });
RoleProjectMapping.belongsTo(DummyProject, { foreignKey: 'project_id' });

User.hasMany(UserEmail, { foreignKey: 'user_id' });
UserEmail.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(TestResult, { foreignKey: 'user_id' });
TestResult.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(UserOutput, { foreignKey: 'user_id' });
UserOutput.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(RecommendationEvent, { foreignKey: 'user_id' });
RecommendationEvent.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  CareerField,
  IndustryCategory,
  Role,
  Skill,
  RoleSkill,
  LearningResource,
  DummyProject,
  RoleProjectMapping,
  RecommendationEvent,
  User,
  UserEmail,
  TestResult,
  UserOutput,
};
