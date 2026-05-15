const express = require('express');
const reportController = require('../controllers/report.controller');

const router = express.Router();

router.post('/send', (req, res, next) => reportController.sendReport(req, res, next));

module.exports = router;
