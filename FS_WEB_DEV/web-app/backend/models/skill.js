const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Skill', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    normalized_name: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'skills',
    timestamps: false,
  });
};
