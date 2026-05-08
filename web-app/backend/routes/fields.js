const express = require('express');
const router = express.Router();
const fieldsController = require('../controllers/fields.controller');

// Route untuk mendapatkan daftar semua bidang industri (F01, F02, dsb)
// GET /api/fields
router.get('/', fieldsController.getFields);

// Route untuk mendapatkan daftar semua skill yang tersedia di database
// GET /api/fields/skills
router.get('/skills', fieldsController.getSkills);

module.exports = router;
