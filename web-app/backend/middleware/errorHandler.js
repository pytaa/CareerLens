// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Joi validation error
  if (err.isJoi) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Validation Error',
      details: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      })),
    });
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Validation Error',
      details: err.errors,
    });
  }

  // Custom error
  if (err.status && err.message) {
    return res.status(err.status).json({
      status: 'error',
      code: err.status,
      message: err.message,
    });
  }

  // Default error
  res.status(500).json({
    status: 'error',
    code: 500,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

module.exports = errorHandler;
