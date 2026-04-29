const { MasterRoles, Roles } = require('../models');
const { validateRecommendationRequest, validateSkillSelection } = require('../middleware/validation');
const { getRecommendations, getRecommendationsBySkill } = require('../services/recommendation.service');

// Get recommendation berdasarkan RIASEC + Skill + Field
exports.getRecommendation = async (req, res, next) => {
  try {
    const { error, value } = validateRecommendationRequest(req.body);
    if (error) {
      const err = new Error(error.details[0].message);
      err.isJoi = true;
      err.details = error.details;
      return next(err);
    }

    const { riasec_scores, selected_skills, selected_fields } = value;

    const recommendations = await getRecommendations(
      riasec_scores,
      selected_skills,
      selected_fields
    );

    res.json({
      status: 'success',
      data: {
        recommendations,
        total_recommendations: recommendations.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get recommendation hanya berdasarkan Skill
exports.getSkillRecommendation = async (req, res, next) => {
  try {
    const { error, value } = validateSkillSelection(req.body);
    if (error) {
      const err = new Error(error.details[0].message);
      err.isJoi = true;
      err.details = error.details;
      return next(err);
    }

    const { selected_skills, selected_fields } = value;

    const recommendations = await getRecommendationsBySkill(
      selected_skills,
      selected_fields
    );

    res.json({
      status: 'success',
      data: {
        recommendations,
        total_recommendations: recommendations.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get detail role tertentu
exports.getRoleDetail = async (req, res, next) => {
  try {
    const { roleId } = req.params;

    const role = await Roles.findByPk(roleId, {
      include: [{ model: MasterRoles, attributes: ['deskripsi', 'skill', 'estimated_salary'] }],
    });

    if (!role) {
      const error = new Error('Role tidak ditemukan');
      error.status = 404;
      return next(error);
    }

    res.json({
      status: 'success',
      data: {
        role: {
          role_id: role.role_id,
          role_name: role.role_name,
          field_id: role.field_id,
          deskripsi: role.MasterRole?.deskripsi,
          estimated_salary: role.MasterRole?.estimated_salary,
          required_skills: role.MasterRole?.skill?.split(',').map(s => s.trim()) || [],
          riasec_scores: {
            R: role.R,
            I: role.I,
            A: role.A,
            S: role.S,
            E: role.E,
            C: role.C,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
