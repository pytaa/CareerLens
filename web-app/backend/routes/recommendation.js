const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');

router.post('/', recommendationController.getRecommendation);
router.post('/skill', recommendationController.getSkillRecommendation);
router.get('/roles/:roleId', recommendationController.getRoleDetail);

module.exports = router;
