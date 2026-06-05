const express = require('express');
const roleController = require('../controllers/role.controller');

const router = express.Router();

// Mengambil semua data Role (pekerjaan)
router.get('/', (req, res, next) => roleController.getAll(req, res, next));

// Mengambil data Role berdasarkan ID (informasi basic)
router.get('/:id', (req, res, next) => roleController.getById(req, res, next));

// Mengambil detail Role lengkap beserta Roadmap dan Skill yang terkait
router.get('/:id/details', (req, res, next) => roleController.getDetails(req, res, next));

module.exports = router;
