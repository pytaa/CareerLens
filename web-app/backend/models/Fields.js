const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fields = sequelize.define('Fields', {
  field_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  field_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'fields',
  timestamps: false,
});

module.exports = Fields;
