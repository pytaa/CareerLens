const { getRoadmapForRole } = require('../services/roadmap.service');

// Get roadmap lengkap untuk role tertentu
exports.getRoadmap = async (req, res, next) => {
  try {
    const { roleId } = req.params;

    if (!roleId) {
      const error = new Error('Role ID diperlukan');
      error.status = 400;
      return next(error);
    }

    const roadmap = await getRoadmapForRole(roleId);

    res.json({
      status: 'success',
      data: {
        roadmap,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
