const express = require('express');
const roleController = require('../controllers/role.controller');

const router = express.Router();

router.get('/', (req, res, next) => roleController.getAll(req, res, next));
router.get('/:id', (req, res, next) => roleController.getById(req, res, next));
router.get('/:id/details', (req, res, next) => roleController.getDetails(req, res, next));

module.exports = router;
