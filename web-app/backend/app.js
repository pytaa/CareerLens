const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const recommendationController = require('./controllers/recommendation.controller');
const { sequelize } = require('./models');

const app = express();

// Mengamankan HTTP headers menggunakan Helmet
app.use(helmet());
// Menyiapkan origin CORS default (lokal)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000'
];

// Menambahkan origin dinamis dari variabel environment untuk deployment (misal: Vercel)
if (process.env.CORS_ORIGIN) {
  const envOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
  allowedOrigins.push(...envOrigins);
}

// Konfigurasi CORS agar frontend dapat berkomunikasi dengan backend
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Parsing body payload berformat JSON
app.use(express.json());

// Menambahkan HTTP request logger
app.use(morgan(process.env.NODE_ENV === 'test' ? 'dev' : 'combined'));

app.get('/', (req, res) => {
  res.json({ message: 'CareerLens Backend API' });
});

// Legacy endpoint for frontend compatibility (Direct prediction routing)
app.post('/predict', (req, res, next) => {
  console.log('predict route controller.service present', !!recommendationController.service);
  return recommendationController.predict(req, res, next);
});

// Daftarkan seluruh routing API di bawah awalan /api
app.use('/api', routes);

// Middleware Catch 404: Jika rute tidak ditemukan, akan diarahkan ke error handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

module.exports = { app, sequelize };
