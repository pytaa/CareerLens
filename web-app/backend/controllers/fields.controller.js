const { Fields, Roles } = require('../models');

// Get semua field/kategori industri
exports.getFields = async (req, res, next) => {
  try {
    const fields = await Fields.findAll();

    res.json({
      status: 'success',
      data: {
        fields,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get semua skill unik
exports.getSkills = async (req, res, next) => {
  try {
    const { MasterRoles } = require('../models');
    
    const roles = await MasterRoles.findAll({
      attributes: ['skill'],
      raw: true,
    });

    // Extract dan unique skills
    const skillsSet = new Set();
    roles.forEach(role => {
      if (role.skill) {
        role.skill.split(',').forEach(skill => {
          skillsSet.add(skill.trim());
        });
      }
    });

    const skills = Array.from(skillsSet).sort();

    res.json({
      status: 'success',
      data: {
        skills,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
