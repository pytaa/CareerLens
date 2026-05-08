require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');
const config = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Routes
const testRoutes = require('./routes/test');
const fieldsRoutes = require('./routes/fields');
const recommendationRoutes = require('./routes/recommendation');
const roadmapRoutes = require('./routes/roadmap');
const resultsRoutes = require('./routes/results');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: config.api.maxRequestSize }));
app.use(express.urlencoded({ limit: config.api.maxRequestSize, extended: true }));

// Database sync on startup
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✓ Database connected and synced successfully');
  })
  .catch(err => {
    console.error('✗ Database sync error:', err);
  });

// API Routes
app.use('/api/test', testRoutes);
app.use('/api/fields', fieldsRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/results', resultsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'success', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Endpoint tidak ditemukan',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`CareerLens Backend API`);
  console.log(`${'='.repeat(60)}`);
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${config.nodeEnv}`);
  console.log(`✓ API Documentation available at http://localhost:${PORT}/api`);
  console.log(`${'='.repeat(60)}\n`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;
