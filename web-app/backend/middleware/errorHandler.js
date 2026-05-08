const config = require('../config/env');

const errorHandler = (err, req, res, next) => {
  if (config.nodeEnv === 'development') {
    console.error(' [Backend Error]:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
  }

  if (err.isJoi || err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Input yang Anda masukkan tidak valid',
      errors: err.details ? err.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      })) : err.message
    });
  }

  if (err.name?.startsWith('Sequelize')) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        status: 'error',
        message: 'Data sudah terdaftar dalam sistem'
      });
    }

    return res.status(400).json({
      status: 'error',
      message: 'Terjadi kesalahan pada saat mengakses database',
      details: config.nodeEnv === 'development' ? err.errors : undefined
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      status: 'error',
      message: err.message
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi kesalahan internal pada server kami',
    error: config.nodeEnv === 'development' ? err.message : 'Internal Server Error'
  });
};

module.exports = errorHandler;

