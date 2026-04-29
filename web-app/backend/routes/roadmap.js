const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmap.controller');

// GET /api/roadmap/:roleId - Get roadmap untuk role tertentu
router.get('/:roleId', roadmapController.getRoadmap);

module.exports = router;
