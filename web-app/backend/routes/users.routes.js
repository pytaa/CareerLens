const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/', function(req, res, next) {
  return userController.getAll(req, res, next);
});
router.get('/:userId/history', function(req, res, next) {
  return userController.getHistory(req, res, next);
});
router.post('/:userId/output', function(req, res, next) {
  return userController.saveOutput(req, res, next);
});

module.exports = router;
