const { v4: uuidv4 } = require('uuid');
const { UserTestResults } = require('../models');

// Save user test results
exports.saveResult = async (req, res, next) => {
  try {
    const { riasec_scores, selected_skills, selected_fields, recommended_roles } = req.body;

    const sessionId = uuidv4();

    const result = await UserTestResults.create({
      user_session_id: sessionId,
      riasec_scores,
      selected_skills,
      selected_fields,
      recommended_roles,
    });

    res.json({
      status: 'success',
      data: {
        result_id: result.result_id,
        session_id: result.user_session_id,
        message: 'Result saved successfully',
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user result berdasarkan session ID
exports.getResult = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      const error = new Error('Session ID diperlukan');
      error.status = 400;
      return next(error);
    }

    const result = await UserTestResults.findOne({
      where: { user_session_id: sessionId },
    });

    if (!result) {
      const error = new Error('Result tidak ditemukan');
      error.status = 404;
      return next(error);
    }

    res.json({
      status: 'success',
      data: {
        result: {
          result_id: result.result_id,
          session_id: result.user_session_id,
          riasec_scores: result.riasec_scores,
          selected_skills: result.selected_skills,
          selected_fields: result.selected_fields,
          recommended_roles: result.recommended_roles,
          created_at: result.created_at,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
