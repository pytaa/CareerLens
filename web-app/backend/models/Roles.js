const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Fields = require('./Fields');

const Roles = sequelize.define('Roles', {
  role_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  field_id: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: Fields,
      key: 'field_id',
    },
  },
  role_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  R: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  I: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  A: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  S: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  E: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  C: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  tableName: 'roles',
  timestamps: false,
});

Roles.belongsTo(Fields, { foreignKey: 'field_id' });

module.exports = Roles;
