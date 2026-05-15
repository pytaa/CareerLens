const BaseService = require('./base.service');
const roleRepository = require('../repositories/role.repository');

class RoleService extends BaseService {
  constructor() {
    super(roleRepository);
  }

  async getRoleDetails(roleId) {
    const details = await this.repository.findDetailsByIdsOrNames([roleId], []);
    return details.length ? details[0] : null;
  }
}

module.exports = new RoleService();
