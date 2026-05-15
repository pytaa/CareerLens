const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const recommendationController = require('./controllers/recommendation.controller');
const { sequelize } = require('./models');

const app = express();

app.use(helmet());
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000'
];

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
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'test' ? 'dev' : 'combined'));

app.get('/', (req, res) => {
  res.json({ message: 'CareerLens Backend API' });
});

// Legacy endpoint for frontend compatibility
app.post('/predict', (req, res, next) => {
  console.log('predict route controller.service present', !!recommendationController.service);
  return recommendationController.predict(req, res, next);
});

app.use('/api', routes);

// Catch 404 and forward to error handler
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
