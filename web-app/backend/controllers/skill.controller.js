const BaseController = require('./base.controller');
const skillService = require('../services/skill.service');

class SkillController extends BaseController {
  constructor() {
    super(skillService);
  }
}

module.exports = new SkillController();
