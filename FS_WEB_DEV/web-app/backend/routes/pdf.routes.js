const express = require('express');
const pdfController = require('../controllers/pdf.controller');

const router = express.Router();

router.post('/minat-karir', (req, res, next) => pdfController.sendMinatKarir(req, res, next));
router.post('/skill', (req, res, next) => pdfController.sendAnalisisSkill(req, res, next));
router.post('/bakat', (req, res, next) => pdfController.sendTesBakat(req, res, next));

module.exports = router;
