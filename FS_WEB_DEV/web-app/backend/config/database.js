require('dotenv').config();
const { Sequelize } = require('sequelize');

// Database configuration from environment variables
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'careerlens',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  storage: process.env.DB_DIALECT === 'sqlite' ? (process.env.DB_STORAGE || 'database.sqlite') : undefined,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;