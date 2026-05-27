const pdfService = require('../services/pdf.service');

class PdfController {
  async sendMinatKarir(req, res, next) {
    try {
      const { email, reqData, resData } = req.body;
      if (!email || !reqData || !resData) {
        return res.status(400).json({ status: 'error', message: 'Email, reqData, dan resData wajib diisi.' });
      }

      const result = await pdfService.sendMinatKarirPdf(email, reqData, resData);
      res.json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  // Nanti akan ditambahkan sendAnalisisSkill dan sendTesBakat di sini
}

module.exports = new PdfController();
