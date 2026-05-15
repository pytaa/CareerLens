const BaseController = require('./base.controller');
const userService = require('../services/user.service');

class UserController extends BaseController {
  constructor() {
    super(userService);
  }

  async getHistory(req, res, next) {
    try {
      const { userId } = req.params;
      const history = await this.service.getUserHistory(userId);
      res.json(history);
    } catch (error) {
      next(error);
    }
  }

  async saveOutput(req, res, next) {
    try {
      const { userId } = req.params;
      const { output_type, output_value, context } = req.body;
      const output = await this.service.saveUserOutput(userId, output_type, output_value, context);
      res.status(201).json(output);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();