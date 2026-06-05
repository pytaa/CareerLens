const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('RoleProjectMapping', {
    role_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    project_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sort_order: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'role_project_mapping',
    timestamps: false,
  });
};
