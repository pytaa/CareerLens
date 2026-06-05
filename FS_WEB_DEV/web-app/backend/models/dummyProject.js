const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('DummyProject', {
    project_id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    judul_project: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    brief_case: {
      type: DataTypes.TEXT,
    },
    instructions: {
      type: DataTypes.TEXT,
    },
    tools_used: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'dummy_projects',
    timestamps: false,
  });
};
