const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const MasterRoles = require('./MasterRoles');

const LearningResources = sequelize.define('LearningResources', {
  resource_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: MasterRoles,
      key: 'role_id',
    },
  },
  step_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nama_skill: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  link_course: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  tipe: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  platform: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'learning_resources',
  timestamps: false,
});

LearningResources.belongsTo(MasterRoles, { foreignKey: 'role_id' });

module.exports = LearningResources;
