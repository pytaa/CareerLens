const { v4: uuidv4 } = require('uuid');
const { UserTestResults } = require('../models');

exports.saveResult = async (req, res, next) => {
  try {
    const { user_id, method, riasec_scores, selected_skills, selected_fields, recommendations } = req.body;

    const result = await UserTestResults.create({
      user_id: user_id || uuidv4(),
      method,
      riasec_scores,
      selected_skills,
      selected_fields,
      recommendations,
    });

    res.status(201).json({
      status: 'success',
      data: {
        result_id: result.result_id,
        user_id: result.user_id,
        message: 'Result saved successfully',
      },
    });

  } catch (error) {
    next(error);
  }
};

exports.getResult = async (req, res, next) => {
  try {
    const { resultId } = req.params;

    const result = await UserTestResults.findByPk(resultId);

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
          user_id: result.user_id,
          method: result.method,
          riasec_scores: result.riasec_scores,
          selected_skills: result.selected_skills,
          selected_fields: result.selected_fields,
          recommendations: result.recommendations,
          created_at: result.created_at,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


module.exports = exports;
