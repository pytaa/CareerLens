const BaseRepository = require('./base.repository');
const { UserEmail } = require('../models');

class UserEmailRepository extends BaseRepository {
  constructor() {
    super(UserEmail);
  }

  async findByEmail(email) {
    return await this.findOne({ where: { email } });
  }
}

module.exports = new UserEmailRepository();
