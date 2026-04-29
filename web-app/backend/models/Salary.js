const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Salary = sequelize.define('Salary', {
  role_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  estimated_salary: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'salary',
  timestamps: false,
});

module.exports = Salary;
