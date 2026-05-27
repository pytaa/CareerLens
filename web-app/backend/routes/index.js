const express = require('express');
const roleRoutes = require('./roles.routes');
const skillRoutes = require('./skills.routes');
const userRoutes = require('./users.routes');
const recommendationRoutes = require('./recommendations.routes');
const reportRoutes = require('./reports.routes');

const router = express.Router();

// Mendaftarkan semua Sub-Router ke dalam Router Utama
router.use('/roles', roleRoutes);
router.use('/skills', skillRoutes);
router.use('/users', userRoutes);
router.use('/recommendations', recommendationRoutes);
// Alias untuk menjaga kompatibilitas dengan frontend yang memanggil singular path
router.use('/recommendation', recommendationRoutes); 
router.use('/reports', reportRoutes);

module.exports = router;
