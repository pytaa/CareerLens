const BaseRepository = require('./base.repository');
const { LearningResource } = require('../models');

class LearningResourceRepository extends BaseRepository {
  constructor() {
    super(LearningResource);
  }

  async findByRoleId(roleId) {
    return await this.findAll({ where: { role_id: roleId }, order: [['step_number', 'ASC']] });
  }
}

module.exports = new LearningResourceRepository();
