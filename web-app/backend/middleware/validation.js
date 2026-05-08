// Mengimpor library Joi untuk validasi skema data
const Joi = require('joi');

const validateTestAnswers = (data) => {
  const schema = Joi.object({
    answers: Joi.array()
      .items(
        Joi.object({
          question_id: Joi.string().required(), // ID pertanyaan wajib ada
          score: Joi.number().min(1).max(5).required().messages({ // Skor harus antara 1-5
            'number.min': 'Skor minimal adalah 1',
            'number.max': 'Skor maksimal adalah 5'
          }),
        })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'Anda harus menjawab minimal satu pertanyaan'
      }),
  });
  // abortEarly: false digunakan agar semua error divalidasi sekaligus (tidak berhenti di error pertama)
  return schema.validate(data, { abortEarly: false });
};

/**
 * Validasi untuk Permintaan Rekomendasi (Kombinasi RIASEC + Skill)
 * Digunakan pada proses rekomendasi utama.
 */
const validateRecommendationRequest = (data) => {
  const schema = Joi.object({
    // Skor RIASEC harus berupa objek dengan key R, I, A, S, E, C (nilai normalisasi 0-1)
    riasec_scores: Joi.object({
      R: Joi.number().min(0).max(1).required(),
      I: Joi.number().min(0).max(1).required(),
      A: Joi.number().min(0).max(1).required(),
      S: Joi.number().min(0).max(1).required(),
      E: Joi.number().min(0).max(1).required(),
      C: Joi.number().min(0).max(1).required(),
    }).required(),
    // User wajib memilih minimal 2 skill untuk akurasi rekomendasi
    selected_skills: Joi.array()
      .items(Joi.string())
      .min(2)
      .required()
      .messages({
        'array.min': 'Masukkan minimal 2 skill berbasis tag untuk hasil yang akurat'
      }),
    // Bidang industri bersifat opsional sebagai filter tambahan
    selected_fields: Joi.array().items(Joi.string()).optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

/**
 * Validasi untuk pilihan skill saja (tanpa tes RIASEC)
 */
const validateSkillSelection = (data) => {
  const schema = Joi.object({
    selected_skills: Joi.array()
      .items(Joi.string())
      .min(2)
      .required()
      .messages({
        'array.min': 'Masukkan minimal 2 skill untuk memulai analisis'
      }),
    selected_fields: Joi.array().items(Joi.string()).optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  validateTestAnswers,
  validateRecommendationRequest,
  validateSkillSelection,
};

