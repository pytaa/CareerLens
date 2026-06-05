const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('IndustryCategory', {
    slug: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    field_id: {
      type: DataTypes.CHAR(3),
      allowNull: false,
    },
    display_title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'industry_categories',
    timestamps: false,
  });
};
