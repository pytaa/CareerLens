const express = require('express');
const recommendationController = require('../controllers/recommendation.controller');

const router = express.Router();

router.post('/', function(req, res, next) {
  return recommendationController.predict(req, res, next);
});
router.post('/skill', function(req, res, next) {
  return recommendationController.predictSkill(req, res, next);
});

module.exports = router;