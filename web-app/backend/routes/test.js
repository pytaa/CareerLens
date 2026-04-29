const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');

// GET /api/test/questions - Get all test questions
router.get('/questions', testController.getTestQuestions);

module.exports = router;
