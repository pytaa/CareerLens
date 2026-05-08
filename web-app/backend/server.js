// Mengimpor konfigurasi dari file .env
require('dotenv').config();

// Mengimpor framework Express dan middleware pendukung
const express = require('express');
const cors = require('cors'); // Untuk menangani Cross-Origin Resource Sharing
const helmet = require('helmet'); // Untuk keamanan (menambahkan header HTTP)
const morgan = require('morgan'); // Untuk logging request HTTP
const sequelize = require('./config/database'); // Koneksi database menggunakan Sequelize
const config = require('./config/env'); // Konfigurasi aplikasi
const logger = require('./middleware/logger'); // Middleware logging kustom
const errorHandler = require('./middleware/errorHandler'); // Middleware penanganan error kustom

// Mengimpor definisi rute (routes)
const testRoutes = require('./routes/test');
const fieldsRoutes = require('./routes/fields');
const recommendationRoutes = require('./routes/recommendation');
const roadmapRoutes = require('./routes/roadmap');
const resultsRoutes = require('./routes/results');

// Inisialisasi aplikasi Express
const app = express();

// --- Konfigurasi Middleware Global ---

// Gunakan Helmet untuk meningkatkan keamanan header HTTP
app.use(helmet());

// Konfigurasi CORS: Mengizinkan akses dari domain luar (saat ini diset '*' untuk kemudahan)
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Gunakan middleware logging kustom
app.use(logger);

// Gunakan Morgan untuk logging request HTTP ke konsol
app.use(morgan('combined'));

// Middleware untuk memparsing body request dalam format JSON
app.use(express.json({ limit: config.api.maxRequestSize }));

// Middleware untuk memparsing body request dalam format URL-encoded
app.use(express.urlencoded({ limit: config.api.maxRequestSize, extended: true }));

// --- Sinkronisasi Database ---
// Menghubungkan dan melakukan sinkronisasi model dengan database PostgreSQL
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database connected and synced successfully');
  })
  .catch(err => {
    console.error('Database sync error:', err);
  });

// --- Definisi Endpoint API ---
app.use('/api/test', testRoutes);
app.use('/api/fields', fieldsRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/results', resultsRoutes);

// Health check endpoint: Untuk memverifikasi apakah server berjalan dengan baik
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// --- Menjalankan Server ---
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Backend API berjalan di http://localhost:${PORT}`);
});

// Middleware Penanganan Error: Harus ditempatkan di paling akhir setelah rute lainnya
app.use(errorHandler);
