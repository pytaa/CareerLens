const express = require('express');
const reportController = require('../controllers/report.controller');

const router = express.Router();

// Endpoint untuk memicu pengiriman email laporan hasil tes ke pengguna
router.post('/send', (req, res, next) => reportController.sendReport(req, res, next));

module.exports = router;
