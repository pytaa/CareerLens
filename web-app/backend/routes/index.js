const express = require('express');
const roleRoutes = require('./roles.routes');
const skillRoutes = require('./skills.routes');
const userRoutes = require('./users.routes');
const recommendationRoutes = require('./recommendations.routes');
const reportRoutes = require('./reports.routes');

const router = express.Router();

router.use('/roles', roleRoutes);
router.use('/skills', skillRoutes);
router.use('/users', userRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/recommendation', recommendationRoutes); // alias untuk frontend yang memanggil singular path
router.use('/reports', reportRoutes);

module.exports = router;
