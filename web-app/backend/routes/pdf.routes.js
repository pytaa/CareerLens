const express = require('express');
const pdfController = require('../controllers/pdf.controller');

const router = express.Router();

router.post('/minat-karir', (req, res, next) => pdfController.sendMinatKarir(req, res, next));
// Nanti akan ditambahkan rute untuk skill dan bakat

module.exports = router;
