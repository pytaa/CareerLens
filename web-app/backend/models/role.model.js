const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Roles = sequelize.define('Roles', {
  role_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  field_id: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  role_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  R: { type: DataTypes.REAL },
  I: { type: DataTypes.REAL },
  A: { type: DataTypes.REAL },
  S: { type: DataTypes.REAL },
  E: { type: DataTypes.REAL },
  C: { type: DataTypes.REAL },
}, {
  tableName: 'roles',
  timestamps: false,
});

module.exports = Roles;
