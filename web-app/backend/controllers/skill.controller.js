const BaseController = require('./base.controller');
const skillService = require('../services/skill.service');


//Mengelola request terkait master data skills
class SkillController extends BaseController {
  constructor() {
    super(skillService);
  }
}

module.exports = new SkillController();
