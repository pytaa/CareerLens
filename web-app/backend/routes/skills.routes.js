const express = require('express');
const skillController = require('../controllers/skill.controller');

const router = express.Router();

// Mengambil seluruh daftar Master Skill
router.get('/', (req, res, next) => skillController.getAll(req, res, next));

// Mengambil satu Skill berdasarkan ID
router.get('/:id', (req, res, next) => skillController.getById(req, res, next));

module.exports = router;
