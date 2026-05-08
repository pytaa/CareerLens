// Mengimpor model database dan fungsi utilitas
const { MasterRoles, Roles } = require('../models');
const { validateRecommendationRequest, validateSkillSelection } = require('../middleware/validation');
const { getRecommendations, getRecommendationsBySkill } = require('../services/recommendation.service');

/**
 * Mendapatkan rekomendasi karir berdasarkan skor RIASEC, skill, dan bidang yang dipilih.
 * Endpoint: POST /api/recommendation
 */
exports.getRecommendation = async (req, res, next) => {
  try {
    // 1. Validasi input request menggunakan Joi
    const { error, value } = validateRecommendationRequest(req.body);
    if (error) {
      const err = new Error(error.details[0].message);
      err.isJoi = true;
      err.details = error.details;
      return next(err); // Teruskan ke middleware errorHandler
    }

    const { riasec_scores, selected_skills, selected_fields } = value;

    // 2. Memanggil service untuk mendapatkan daftar rekomendasi
    const recommendations = await getRecommendations(
      riasec_scores,
      selected_skills,
      selected_fields
    );

    // 3. Mengirimkan respons sukses dengan data rekomendasi
    res.json({
      status: 'success',
      data: {
        recommendations,
        total_recommendations: recommendations.length,
      },
    });
  } catch (error) {
    next(error); // Tangani error jika terjadi masalah pada server/database
  }
};

/**
 * Mendapatkan rekomendasi karir hanya berdasarkan skill dan bidang yang dipilih (tanpa skor RIASEC).
 * Endpoint: POST /api/recommendation/by-skill
 */
exports.getSkillRecommendation = async (req, res, next) => {
  try {
    // 1. Validasi input pilihan skill
    const { error, value } = validateSkillSelection(req.body);
    if (error) {
      const err = new Error(error.details[0].message);
      err.isJoi = true;
      err.details = error.details;
      return next(err);
    }

    const { selected_skills, selected_fields } = value;

    // 2. Memanggil service rekomendasi berbasis skill
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

/**
 * Mendapatkan detail lengkap dari sebuah role/pekerjaan berdasarkan ID.
 * Endpoint: GET /api/recommendation/role/:roleId
 */
exports.getRoleDetail = async (req, res, next) => {
  try {
    const { roleId } = req.params;

    // 1. Cari role di database dan sertakan informasi dari tabel MasterRoles (join)
    const role = await Roles.findByPk(roleId, {
      include: [{ model: MasterRoles, attributes: ['deskripsi', 'skill', 'estimated_salary'] }],
    });

    // 2. Jika role tidak ditemukan, kirim error 404
    if (!role) {
      const error = new Error('Role tidak ditemukan');
      error.status = 404;
      return next(error);
    }

    // 3. Format data role sebelum dikirim ke client
    res.json({
      status: 'success',
      data: {
        role: {
          role_id: role.role_id,
          role_name: role.role_name,
          field_id: role.field_id,
          deskripsi: role.MasterRole?.deskripsi,
          estimated_salary: role.MasterRole?.estimated_salary,
          // Mengubah string skill yang dipisahkan koma menjadi array
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
