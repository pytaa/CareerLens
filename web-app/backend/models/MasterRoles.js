const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Fields = require('./Fields');

const MasterRoles = sequelize.define('MasterRoles', {
  role_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  field_id: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  role_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  skill: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  estimated_salary: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'master_roles',
  timestamps: false,
});

MasterRoles.belongsTo(Fields, { foreignKey: 'field_id' });

module.exports = MasterRoles;
