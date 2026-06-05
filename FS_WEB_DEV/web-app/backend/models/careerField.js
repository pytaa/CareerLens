const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('CareerField', {
    field_id: {
      type: DataTypes.CHAR(3),
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    sort_order: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'career_fields',
    timestamps: false,
  });
};
