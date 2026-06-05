const pdfService = require('../services/pdf.service');
const userRepository = require('../repositories/user.repository');
const userEmailRepository = require('../repositories/user.email.repository');

const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return typeof uuid === 'string' && uuidRegex.test(uuid);
};

class PdfController {
  async sendMinatKarir(req, res, next) {
    try {
      const { email, reqData, resData, userId } = req.body;
      if (!email || !reqData || !resData) {
        return res.status(400).json({ status: 'error', message: 'Email, reqData, dan resData wajib diisi.' });
      }

      if (userId && isValidUUID(userId)) {
        await userRepository.update(userId, { email });
        const existingEmail = await userEmailRepository.findOne({ where: { user_id: userId, email: email } });
        if (!existingEmail) {
          await userEmailRepository.create({ user_id: userId, email: email, is_primary: true });
        }
      }

      const result = await pdfService.sendMinatKarirPdf(email, reqData, resData);
      res.json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async sendAnalisisSkill(req, res, next) {
    try {
      const { email, reqData, resData, userId } = req.body;
      if (!email || !reqData || !resData) {
        return res.status(400).json({ status: 'error', message: 'Email, reqData, dan resData wajib diisi.' });
      }

      if (userId && isValidUUID(userId)) {
        await userRepository.update(userId, { email });
        const existingEmail = await userEmailRepository.findOne({ where: { user_id: userId, email: email } });
        if (!existingEmail) {
          await userEmailRepository.create({ user_id: userId, email: email, is_primary: true });
        }
      }

      const result = await pdfService.sendSkillPdf(email, reqData, resData);
      res.json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }
  async sendTesBakat(req, res, next) {
    try {
      const { email, reqData, resData, userId } = req.body;
      if (!email || !reqData || !resData) {
        return res.status(400).json({ status: 'error', message: 'Email, reqData, dan resData wajib diisi.' });
      }

      if (userId && isValidUUID(userId)) {
        await userRepository.update(userId, { email });
        const existingEmail = await userEmailRepository.findOne({ where: { user_id: userId, email: email } });
        if (!existingEmail) {
          await userEmailRepository.create({ user_id: userId, email: email, is_primary: true });
        }
      }

      const result = await pdfService.sendBakatPdf(email, reqData, resData);
      res.json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PdfController();
