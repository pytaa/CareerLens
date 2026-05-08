const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Model Fields: Merepresentasikan tabel 'fields' di database.
 * Digunakan untuk menyimpan kategori bidang industri (contoh: Technology, Business, Design).
 */
const Fields = sequelize.define('Fields', {
  // ID unik bidang industri (contoh: 'F01')
  field_id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  // Nama bidang industri (contoh: 'Technology')
  field_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'fields', // Nama tabel eksplisit di database
  timestamps: false,    // Tidak menggunakan kolom createdAt dan updatedAt
});

module.exports = Fields;
