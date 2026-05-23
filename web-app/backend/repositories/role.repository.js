const { Op } = require('sequelize');
const BaseRepository = require('./base.repository');
const { Role, LearningResource, RoleProjectMapping, DummyProject, Skill } = require('../models');

/**
 * Repository untuk operasi database entitas Role (Pekerjaan).
 */
class RoleRepository extends BaseRepository {
  constructor() {
    super(Role);
  }

  async findByFieldId(fieldId) {
    return await this.findAll({ where: { field_id: fieldId } });
  }

  /**
   * Mencari daftar Role berdasarkan kemiripan (similarity) skor RIASEC.
   * Digunakan oleh algoritma fallback prediksi RIASEC.
   */
  async findByRiasecScores(scores, limit = 5) {
    const { r, i, a, s, e, c } = scores;
    return await this.findAll({
      order: [
        [this.model.sequelize.literal(`ABS(riasec_r - ${r}) + ABS(riasec_i - ${i}) + ABS(riasec_a - ${a}) + ABS(riasec_s - ${s}) + ABS(riasec_e - ${e}) + ABS(riasec_c - ${c})`), 'ASC']
      ],
      limit
    });
  }

  /**
   * Mengambil detail komprehensif role beserta relasinya (Learning Resource, Dummy Project, Skill).
   * Digunakan untuk memperkaya (enrich) data rekomendasi dari AI.
   */
  async findDetailsByIdsOrNames(roleIds = [], roleNames = []) {
    const conditions = [];

    if (roleIds.length) {
      conditions.push({ role_id: { [Op.in]: roleIds } });
    }

    if (roleNames.length) {
      conditions.push({ role_name: { [Op.in]: roleNames } });
    }

    if (!conditions.length) {
      return [];
    }

    return await this.findAll({
      where: { [Op.or]: conditions },
      include: [
        {
          model: LearningResource,
          attributes: ['step_number', 'nama_skill', 'link_course', 'tipe', 'platform'],
        },
        {
          model: RoleProjectMapping,
          attributes: ['sort_order'],
          include: [
            {
              model: DummyProject,
              attributes: ['project_id', 'judul_project', 'brief_case', 'tools_used']
            }
          ]
        },
        {
          model: Skill,
          attributes: ['name']
        }
      ]
    });
  }
}

module.exports = new RoleRepository();