const BaseRepository = require('./base.repository');
const { UserOutput } = require('../models');

//Repository untuk menyimpan output rekomendasi akhir yang dihasilkan untuk pengguna.
class UserOutputRepository extends BaseRepository {
  constructor() {
    super(UserOutput);
  }

  async findByUserId(userId) {
    return await this.findAll({ where: { user_id: userId } });
  }

  async findByType(outputType) {
    return await this.findAll({ where: { output_type: outputType } });
  }
}

module.exports = new UserOutputRepository();