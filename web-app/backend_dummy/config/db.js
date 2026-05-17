const { Pool } = require('pg');
require('dotenv').config();

// Mengambil konfigurasi dari file .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// cek koneksi 
pool.connect((err, client, release) => {
  if (err) {
    console.error('Terjadi kesalahan saat menghubungkan ke database:', err.stack);
  } else {
    console.log('Berhasil terhubung ke database PostgreSQL CareerLens');
  }
  if (client) release();
});

module.exports = pool;