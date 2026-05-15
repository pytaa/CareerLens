const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('RoleSkill', {
    role_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    skill_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    weight: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'role_skills',
    timestamps: false,
  });
};
