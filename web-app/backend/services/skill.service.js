const BaseService = require('./base.service');
const skillRepository = require('../repositories/skill.repository');

/**
untuk mengambil daftar skill yang ada di database.
 */
class SkillService extends BaseService {
  constructor() {
    super(skillRepository);
  }
}

module.exports = new SkillService();
