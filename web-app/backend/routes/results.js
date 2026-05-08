const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/results.controller');

router.post('/save', resultsController.saveResult);
router.get('/:resultId', resultsController.getResult);


module.exports = router;
