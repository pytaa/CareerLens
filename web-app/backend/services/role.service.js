const BaseService = require('./base.service');
const roleRepository = require('../repositories/role.repository');

/**
 * Service untuk mengelola entitas Role Pekerjaan.
 */
class RoleService extends BaseService {
  constructor() {
    super(roleRepository);
  }

  /**
   * Mengambil satu data role beserta detail komplitnya (Learning resources, dll).
   */
  async getRoleDetails(roleId) {
    const details = await this.repository.findDetailsByIdsOrNames([roleId], []);
    return details.length ? details[0] : null;
  }
}

module.exports = new RoleService();
