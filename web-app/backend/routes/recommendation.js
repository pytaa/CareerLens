const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');

// POST /api/recommendation - Get recommendation berdasarkan RIASEC + Skills
router.post('/', recommendationController.getRecommendation);

// POST /api/recommendation/skill - Get recommendation hanya berdasarkan skill
router.post('/skill', recommendationController.getSkillRecommendation);

// GET /api/recommendation/roles/:roleId - Get role detail
router.get('/roles/:roleId', recommendationController.getRoleDetail);

module.exports = router;
