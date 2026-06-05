const BaseRepository = require('./base.repository');
const { Skill } = require('../models');

//Repository untuk operasi database entitas Skill.
class SkillRepository extends BaseRepository {
  constructor() {
    super(Skill);
  }
}

module.exports = new SkillRepository();
