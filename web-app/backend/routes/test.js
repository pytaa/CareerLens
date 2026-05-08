const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');

router.get('/questions', testController.getTestQuestions);
router.post('/submit', testController.submitTest);

module.exports = router;
