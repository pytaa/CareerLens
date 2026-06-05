const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('LearningResource', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    role_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    step_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nama_skill: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    link_course: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipe: {
      type: DataTypes.TEXT,
    },
    platform: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'learning_resources',
    timestamps: false,
  });
};
