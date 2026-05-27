const BaseRepository = require('./base.repository');
const { User } = require('../models');

/**
 * Repository untuk entitas User (Pengguna).
 */
class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByExternalRef(externalRef) {
    return await this.findOne({ where: { external_ref: externalRef } });
  }

  async findByEmail(email) {
    return await this.findOne({ where: { email } });
  }
}

module.exports = new UserRepository();