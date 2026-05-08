const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MasterRoles = sequelize.define('MasterRoles', {
  role_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
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
  },
  skill: {
    type: DataTypes.TEXT,
  },
  estimated_salary: {
    type: DataTypes.STRING(100),
  },

}, {
  tableName: 'master_roles',
  timestamps: false,
});

module.exports = MasterRoles;
