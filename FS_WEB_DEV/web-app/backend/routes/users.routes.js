const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Mendapatkan daftar seluruh pengguna
router.get('/', function(req, res, next) {
  return userController.getAll(req, res, next);
});

// Mendapatkan riwayat prediksi dan hasil rekomendasi spesifik milik pengguna tertentu
router.get('/:userId/history', function(req, res, next) {
  return userController.getHistory(req, res, next);
});

// Menyimpan sebuah rekomendasi karir ke dalam profil pengguna (Bookmark/Save result)
router.post('/:userId/output', function(req, res, next) {
  return userController.saveOutput(req, res, next);
});

module.exports = router;
