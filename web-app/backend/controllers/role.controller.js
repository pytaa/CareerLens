const BaseController = require('./base.controller');
const roleService = require('../services/role.service');

class RoleController extends BaseController {
  constructor() {
    super(roleService);
  }

  /**
   * Mengambil detail spesifik dari sebuah role pekerjaan beserta seluruh relasinya
   * (seperti skill yang dibutuhkan, roadmap/learning resources, dan dummy projects).
   */
  async getDetails(req, res, next) {
    try {
      const { id } = req.params;
      const data = await this.service.getRoleDetails(id);
      if (!data) {
        return res.status(404).json({ error: 'Role details not found' });
      }
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RoleController();
