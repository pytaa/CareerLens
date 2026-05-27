const BaseRepository = require('./base.repository');
const { UserEmail } = require('../models');

/**
 * Repository untuk melacak pengiriman email ke pengguna.
 */
class UserEmailRepository extends BaseRepository {
  constructor() {
    super(UserEmail);
  }

  async findByEmail(email) {
    return await this.findOne({ where: { email } });
  }
}

module.exports = new UserEmailRepository();
