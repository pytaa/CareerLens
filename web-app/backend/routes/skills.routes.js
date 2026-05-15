const express = require('express');
const skillController = require('../controllers/skill.controller');

const router = express.Router();

router.get('/', (req, res, next) => skillController.getAll(req, res, next));
router.get('/:id', (req, res, next) => skillController.getById(req, res, next));

module.exports = router;
