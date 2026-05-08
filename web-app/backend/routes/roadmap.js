const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmap.controller');

router.get('/:roleId', roadmapController.getRoadmap);

module.exports = router;
