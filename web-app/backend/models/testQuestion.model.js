const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestQuestions = sequelize.define('TestQuestions', {
  question_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  questions: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  riasec_type: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    validate: {
      isIn: [['R', 'I', 'A', 'S', 'E', 'C']],
    },
  },
}, {
  tableName: 'test_questions',
  timestamps: false,
});

module.exports = TestQuestions;
