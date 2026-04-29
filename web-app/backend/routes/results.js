const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/results.controller');

// POST /api/results/save - Save user test results
router.post('/save', resultsController.saveResult);

// GET /api/results/:sessionId - Get saved results
router.get('/:sessionId', resultsController.getResult);

module.exports = router;
