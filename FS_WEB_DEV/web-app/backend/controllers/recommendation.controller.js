const BaseController = require('./base.controller');
const recommendationService = require('../services/recommendation.service');

class RecommendationController extends BaseController {
  constructor() {
    super(recommendationService);
  }

   // Endpoint utama (Router) untuk semua prediksi AI.
   //Fungsi ini membedakan jenis prediksi berdasarkan nilai `method` (interest, skill, riasec).

  async predict(req, res, next) {
    try {
      const { user_id, method, payload = {} } = req.body || {};

      if (!method) {
        return res.status(400).json({ message: 'Method is required.' });
      }

      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ message: 'Payload is required.' });
      }

      let result;
      switch (method) {
        case 'interest': {
          // Normalisasi key dari payload (interest_id atau field_id)
          const interestId = payload.interest_id || payload.field_id;
          if (!interestId) {
            return res.status(400).json({ message: 'interest_id is required in payload.' });
          }
          result = await this.service.predictInterest(interestId, user_id);
          break;
        }
        case 'skill': {
          // Normalisasi input untuk skill dan bidang (field)
          const skills = payload.skills || payload.selected_skills || [];
          const selectedFields = payload.selected_fields || payload.fields || [];
          if (!Array.isArray(skills) || skills.length < 2) {
            return res.status(400).json({ message: 'Minimal 2 skill diperlukan.' });
          }
          result = await this.service.predictSkill(skills, selectedFields, user_id);
          break;
        }
        case 'riasec': {
          // Ekstrak skor RIASEC (bisa berupa object {r: 0.8, i: 0.9})
          const scores = payload.riasec_scores || payload.scores || payload;
          if (!scores || typeof scores !== 'object' || Object.keys(scores).length === 0) {
            return res.status(400).json({ message: 'riasec_scores atau skor RIASEC diperlukan.' });
          }
          result = await this.service.predictRiasec(scores, user_id);
          break;
        }
        default:
          return res.status(400).json({ message: 'Invalid method' });
      }

      res.json({
        status: 'success',
        method_used: method,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
  
   // Endpoint khusus untuk prediksi skill (Alternatif dari router utama).
  async predictSkill(req, res, next) {
    try {
      const { user_id, selected_skills, selected_fields } = req.body;
      const skills = selected_skills || [];
      const fields = selected_fields || [];

      if (!Array.isArray(skills) || skills.length < 2) {
        return res.status(400).json({ message: 'Minimal 2 skill diperlukan.' });
      }

      const result = await this.service.predictSkill(skills, fields, user_id);

      res.json({
        status: 'success',
        method_used: 'skill',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecommendationController();