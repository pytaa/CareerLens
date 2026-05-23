const BaseController = require('./base.controller');
const reportService = require('../services/report.service');

class ReportController extends BaseController {
  constructor() {
    super(reportService);
  }

  /**
   * Mengirimkan laporan hasil analisa/rekomendasi pengguna ke email mereka.
   * Endpoint ini akan memanggil reportService untuk proses kompilasi PDF/Email.
   */
  
  async sendReport(req, res, next) {
    try {
      const { email, user_id, profile, summary, recommendations, riasec_scores } = req.body;
      const result = await this.service.sendAnalysisReport({ email, user_id, profile, summary, recommendations, riasec_scores });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
