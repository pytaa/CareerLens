const BaseService = require('./base.service');
const roleRepository = require('../repositories/role.repository');
const testResultRepository = require('../repositories/test.result.repository');
const userOutputRepository = require('../repositories/user.output.repository');
const axios = require('axios');

class RecommendationService extends BaseService {
  constructor() {
    super(null); // No single repository
    this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    this.aiTimeout = parseInt(process.env.AI_SERVICE_TIMEOUT) || 30000;
  }

  //Memprediksi minat
  async predictInterest(interestId, userId = null) {
    let result;
    const normalizedInterestId = this._normalizeInterestId(interestId);

    try {
      const aiResponse = await axios.post(`${this.aiServiceUrl}/predict`, {
        user_id: userId || 'anonymous',
        method: 'interest',
        payload: { interest_id: normalizedInterestId }
      }, {
        timeout: this.aiTimeout,
        headers: { 'Content-Type': 'application/json' }
      });

      const aiData = aiResponse.data;

      if (userId) {
        await testResultRepository.create({
          user_id: userId,
          test_name: 'interest',
          test_payload: { interest_id: normalizedInterestId },
          result_payload: aiData,
          passed: aiData.status === 'success'
        });
      }

      result = aiData.data;
    } catch (error) {
      console.error('AI Service Error (interest):', error.message);
      console.log('Falling back to local interest prediction');
      result = await this._fallbackPredictInterest(normalizedInterestId, userId);
    }

    const enriched = await this._enrichPredictionResult(result);
    if (userId) await this._storeUserOutput(userId, 'interest', { interest_id: normalizedInterestId }, enriched);
    return enriched;
  }

  //Memprediksi Keahlian
  async predictSkill(selectedSkills, selectedFields = [], userId = null) {
    let result;
    const skills = Array.isArray(selectedSkills) ? selectedSkills : [];
    const fields = Array.isArray(selectedFields) ? selectedFields : [];

    try {
      const aiResponse = await axios.post(`${this.aiServiceUrl}/predict`, {
        user_id: userId || 'anonymous',
        method: 'skill',
        payload: { skills, selected_fields: fields }
      }, {
        timeout: this.aiTimeout,
        headers: { 'Content-Type': 'application/json' }
      });

      const aiData = aiResponse.data;

      if (userId) {
        await testResultRepository.create({
          user_id: userId,
          test_name: 'skill',
          test_payload: { selected_skills: skills, selected_fields: fields },
          result_payload: aiData,
          passed: aiData.status === 'success'
        });
      }

      result = aiData.data;
    } catch (error) {
      console.error('AI Service Error (skill):', error.message);
      console.log('Falling back to local skill prediction');
      result = await this._fallbackPredictSkill(skills, fields, userId);
    }

    const enriched = await this._enrichPredictionResult(result);
    if (userId) await this._storeUserOutput(userId, 'skill', { skills, selected_fields: fields }, enriched);
    return enriched;
  }

  // Memprediksi RIASEC
  async predictRiasec(payload, userId = null) {
    let result;
    const scores = this._normalizeRiasecPayload(payload);

    try {
      const aiResponse = await axios.post(`${this.aiServiceUrl}/predict`, {
        user_id: userId || 'anonymous',
        method: 'riasec',
        payload: scores
      }, {
        timeout: this.aiTimeout,
        headers: { 'Content-Type': 'application/json' }
      });

      const aiData = aiResponse.data;

      if (userId) {
        await testResultRepository.create({
          user_id: userId,
          test_name: 'riasec',
          test_payload: scores,
          result_payload: aiData,
          passed: aiData.status === 'success'
        });
      }

      result = aiData.data;
    } catch (error) {
      console.error('AI Service Error (riasec):', error.message);
      console.log('Falling back to local RIASEC prediction');
      result = await this._fallbackPredictRiasec(scores, userId);
    }

    const enriched = await this._enrichPredictionResult(result);
    if (userId) await this._storeUserOutput(userId, 'riasec', { riasec_scores: scores }, enriched);
    return enriched;
  }

  //Mengambil data dari database 
  async _enrichPredictionResult(result) {
    if (!result || !Array.isArray(result.recommendations)) {
      return result;
    }

    const enrichedRecommendations = await this._loadRoleDetails(result.recommendations);
    let chartData = null;
    if (result.hasOwnProperty('chart_data')) {
      if (result.chart_data && Array.isArray(result.chart_data.labels) && Array.isArray(result.chart_data.scores)) {
        chartData = result.chart_data;
      } else if (result.chart_data === null) {
        chartData = null;
      } else {
        chartData = this._buildChartData(enrichedRecommendations);
      }
    } else {
      chartData = this._buildChartData(enrichedRecommendations);
    }

    return {
      ...result,
      chart_data: chartData,
      recommendations: enrichedRecommendations
    };
  }

  //mengambil data role dari database 
  async _loadRoleDetails(recommendations) {
    const roleIds = recommendations
      .map(item => item.role_id)
      .filter(Boolean);
    const roleNames = recommendations
      .filter(item => !item.role_id && item.role_name)
      .map(item => item.role_name);

    const details = await roleRepository.findDetailsByIdsOrNames(roleIds, roleNames);
    const detailsById = {};
    const detailsByName = {};

    details.forEach(role => {
      detailsById[role.role_id] = role;
      detailsByName[role.role_name.toLowerCase()] = role;
    });

    return recommendations.map(item => {
      const key = item.role_id || item.role_name;
      const roleDetail = item.role_id ? detailsById[item.role_id] : detailsByName[item.role_name?.toLowerCase()];

      if (!roleDetail) {
        return this._normalizeRecommendation(item);
      }

      const normalized = this._normalizeRecommendation(item);
      normalized.description = normalized.description || roleDetail.description || '';
      normalized.salary_range = normalized.salary_range || roleDetail.salary_range || '';
      normalized.skill_relevant = Array.isArray(normalized.skill_relevant) && normalized.skill_relevant.length
        ? normalized.skill_relevant
        : (roleDetail.Skills || []).map(skill => skill.name);
      normalized.roadmap = this._buildRoadmap(roleDetail, normalized.roadmap);

      return normalized;
    });
  }

  //normalisasi data rekomendasi
  _normalizeRecommendation(item) {
    return {
      role_id: item.role_id || null,
      role_name: item.role_name || item.name || null,
      match_pct: item.match_pct != null ? item.match_pct : null,
      description: item.description || null,
      salary_range: item.salary_range || null,
      skill_relevant: Array.isArray(item.skill_relevant) ? item.skill_relevant : [],
      skill_gap: Array.isArray(item.skill_gap) ? item.skill_gap : [],
      roadmap: item.roadmap || { learning_path: [], dummy_projects: [] }
    };
  }

  _buildRoadmap(roleDetail, existingRoadmap = { learning_path: [], dummy_projects: [] }) {
    const learningPath = (roleDetail.LearningResources || [])
      .slice()
      .sort((a, b) => a.step_number - b.step_number)
      .map(item => ({
        step: item.step_number,
        nama_skill: item.nama_skill,
        link_course: item.link_course,
        tipe: item.tipe,
        platform: item.platform,
        title: item.nama_skill,
        resource: item.platform
      }));

    const dummyProjects = (roleDetail.RoleProjectMappings || [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapping => {
        const project = mapping.DummyProject;
        return project?.judul_project || '';
      });

    return {
      learning_path: learningPath.length ? learningPath : (existingRoadmap.learning_path || []),
      dummy_projects: dummyProjects.length ? dummyProjects : (existingRoadmap.dummy_projects || [])
    };
  }

  //membangun data chart
  _buildChartData(recommendations) {
    const labels = recommendations.map(item => item.role_name || 'Unknown');
    const scores = recommendations.map(item => {
      if (typeof item.match_pct === 'number') {
        return item.match_pct;
      }
      return 0;
    });

    return { labels, scores };
  }

  //menormalisasi data riasec
  _normalizeRiasecPayload(payload) {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid RIASEC payload');
    }

    if (payload.riasec_scores && typeof payload.riasec_scores === 'object') {
      return payload.riasec_scores;
    }

    if (payload.scores && typeof payload.scores === 'object') {
      return payload.scores;
    }

    return payload;
  }

  //menormalisasi data interest
  _normalizeInterestId(interestId) {
    const normalized = String(interestId || '').trim();
    const interestMapping = {
      'it_software': 'F01',
      'data_science': 'F02',
      'design_uiux': 'F03',
      'digital_marketing': 'F04',
      'F01': 'F01',
      'F02': 'F02',
      'F03': 'F03',
      'F04': 'F04'
    };

    return interestMapping[normalized] || normalized;
  }

  //menyimpan data user output
  async _storeUserOutput(userId, outputType, context, outputValue) {
    try {
      await userOutputRepository.create({
        user_id: userId,
        output_type: outputType,
        output_value: outputValue,
        context
      });
    } catch (error) {
      console.error('Failed to store user output:', error.message);
    }
  }

  // Fallback methods for when AI service is unavailable
  async _fallbackPredictInterest(interestId, userId = null) {
    const fieldMapping = {
      'it_software': 'F01',
      'data_science': 'F02',
      'design_uiux': 'F03',
      'digital_marketing': 'F04',
      'F01': 'F01',
      'F02': 'F02',
      'F03': 'F03',
      'F04': 'F04'
    };

    const fieldId = fieldMapping[interestId] || interestId;
    if (!fieldId || !['F01', 'F02', 'F03', 'F04'].includes(fieldId)) {
      throw new Error('Invalid interest ID');
    }

    const roles = await roleRepository.findByFieldId(fieldId);

    return {
      chart_data: null,
      recommendations: roles.slice(0, 3).map(role => ({
        role_id: role.role_id,
        role_name: role.role_name,
        match_pct: null,
        description: role.description,
        salary_range: role.salary_range,
        skill_relevant: [],
        skill_gap: [],
        roadmap: {
          learning_path: [],
          dummy_projects: []
        }
      }))
    };
  }

  async _fallbackPredictSkill(selectedSkills, selectedFields = [], userId = null) {
    // For now, return all roles (implement skill matching later)
    const roles = await roleRepository.findAll();

    return {
      chart_data: {
        labels: roles.slice(0, 3).map(r => r.role_name),
        scores: [85.0, 75.0, 65.0] // Dummy scores
      },
      recommendations: roles.slice(0, 3).map((role, index) => ({
        role_id: role.role_id,
        role_name: role.role_name,
        match_pct: 85.0 - (index * 10),
        description: role.description,
        salary_range: role.salary_range,
        skill_relevant: selectedSkills.slice(0, 3),
        skill_gap: selectedSkills.length > 3 ? selectedSkills.slice(3) : [],
        roadmap: {
          learning_path: [], // Would need to populate from learning_resources
          dummy_projects: [] // Would need to populate from role_project_mapping
        }
      }))
    };
  }

  async _fallbackPredictRiasec(scores, userId = null) {
    const roles = await roleRepository.findByRiasecScores(scores);

    return {
      chart_data: {
        labels: roles.slice(0, 3).map(r => r.role_name),
        scores: [90.0, 80.0, 70.0] // Dummy scores
      },
      recommendations: roles.slice(0, 3).map((role, index) => ({
        role_id: role.role_id,
        role_name: role.role_name,
        match_pct: 90.0 - (index * 10),
        description: role.description,
        salary_range: role.salary_range,
        skill_relevant: [], // Would need to populate
        skill_gap: [],
        roadmap: {
          learning_path: [], // Would need to populate
          dummy_projects: [] // Would need to populate
        }
      }))
    };
  }
}

module.exports = new RecommendationService();