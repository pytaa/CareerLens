const Joi = require('joi');

// Validation untuk Test Answers
const validateTestAnswers = (data) => {
  const schema = Joi.object({
    answers: Joi.array()
      .items(
        Joi.object({
          question_id: Joi.string().required(),
          score: Joi.number().min(1).max(5).required(),
        })
      )
      .required(),
  });
  return schema.validate(data);
};

// Validation untuk Recommendation Request
const validateRecommendationRequest = (data) => {
  const schema = Joi.object({
    riasec_scores: Joi.object({
      R: Joi.number().min(0).max(1),
      I: Joi.number().min(0).max(1),
      A: Joi.number().min(0).max(1),
      S: Joi.number().min(0).max(1),
      E: Joi.number().min(0).max(1),
      C: Joi.number().min(0).max(1),
    }).required(),
    selected_skills: Joi.array().items(Joi.string()).required(),
    selected_fields: Joi.array().items(Joi.string()).optional(),
  });
  return schema.validate(data);
};

// Validation untuk Skill Selection
const validateSkillSelection = (data) => {
  const schema = Joi.object({
    selected_skills: Joi.array()
      .items(Joi.string())
      .min(2)
      .required(),
    selected_fields: Joi.array()
      .items(Joi.string())
      .optional(),
  });
  return schema.validate(data);
};

module.exports = {
  validateTestAnswers,
  validateRecommendationRequest,
  validateSkillSelection,
};
