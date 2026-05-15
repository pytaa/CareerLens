const BaseService = require('./base.service');
const skillRepository = require('../repositories/skill.repository');

class SkillService extends BaseService {
  constructor() {
    super(skillRepository);
  }
}

module.exports = new SkillService();
