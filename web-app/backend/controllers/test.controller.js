const { TestQuestions } = require('../models');

// Get semua pertanyaan test
exports.getTestQuestions = async (req, res, next) => {
  try {
    const questions = await TestQuestions.findAll({
      order: [['question_id', 'ASC']],
    });

    res.json({
      status: 'success',
      data: {
        questions: questions.map(q => ({
          question_id: q.question_id,
          questions: q.questions,
          riasec_type: q.riasec_type,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
