const express = require('express');
const router = express.Router();
const fieldsController = require('../controllers/fields.controller');

// GET /api/fields - Get all fields
router.get('/', fieldsController.getFields);

// GET /api/fields/skills - Get all unique skills
router.get('/skills', fieldsController.getSkills);

module.exports = router;
