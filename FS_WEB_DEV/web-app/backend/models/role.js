const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Role', {
    role_id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    field_id: {
      type: DataTypes.CHAR(3),
      allowNull: false,
    },
    role_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    salary_range: {
      type: DataTypes.TEXT,
    },
    riasec_r: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    riasec_i: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    riasec_a: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    riasec_s: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    riasec_e: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    riasec_c: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'roles',
    timestamps: false,
  });
};
