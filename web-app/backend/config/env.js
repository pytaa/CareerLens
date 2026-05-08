require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'careerlens',
    port: process.env.DB_PORT || 5432,
  },
  api: {
    timeout: parseInt(process.env.API_TIMEOUT) || 60000,
    maxRequestSize: process.env.API_MAX_REQUEST_SIZE || '50mb',
  },
  aiModel: {
    url: process.env.AI_MODEL_URL || 'http://localhost:8000/predict',
  },
};

module.exports = config;

