const { TestQuestions } = require('../models');

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

exports.submitTest = async (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ status: 'error', message: 'Jawaban tidak valid' });
    }

    const questions = await TestQuestions.findAll();
    const questionMap = questions.reduce((acc, q) => {
      acc[q.question_id] = q.riasec_type;
      return acc;
    }, {});

    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    answers.forEach(ans => {
      const type = questionMap[ans.question_id];
      if (type) {
        scores[type] += ans.score;
        counts[type] += 1;
      }
    });


    const normalized = {};
    Object.keys(scores).forEach(type => {
      normalized[type] = counts[type] > 0 ? (scores[type] / (counts[type] * 5)) : 0;
    });

    res.json({
      status: 'success',
      data: {
        riasec_scores: normalized,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;

