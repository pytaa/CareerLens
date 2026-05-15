const BaseController = require('./base.controller');
const reportService = require('../services/report.service');

class ReportController extends BaseController {
  constructor() {
    super(reportService);
  }

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
