const express = require('express');
const recommendationController = require('../controllers/recommendation.controller');

const router = express.Router();

// Endpoint utama prediksi (method di-passing via body: riasec, interest, skill)
router.post('/', function(req, res, next) {
  return recommendationController.predict(req, res, next);
});

// Endpoint alternatif/spesifik untuk memprediksi hanya berdasarkan skill
router.post('/skill', function(req, res, next) {
  return recommendationController.predictSkill(req, res, next);
});

module.exports = router;