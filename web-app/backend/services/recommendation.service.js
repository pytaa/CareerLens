const BaseService = require('./base.service');
const roleRepository = require('../repositories/role.repository');
const testResultRepository = require('../repositories/test.result.repository');
const userOutputRepository = require('../repositories/user.output.repository');
const userRepository = require('../repositories/user.repository');
const axios = require('axios');
const axiosRetry = require('axios-retry').default || require('axios-retry');
const NodeCache = require('node-cache');

// Configure axios to retry on timeouts or 5xx errors (useful for Hugging Face cold starts)
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED' || (error.response && error.response.status >= 500);
  }
});
class RecommendationService extends BaseService {
  constructor() {
    super(null); 
    this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    this.aiTimeout = parseInt(process.env.AI_SERVICE_TIMEOUT) || 120000;
    
    // Inisialisasi Cache In-Memory dengan TTL 1 jam (3600 detik)
    this.cache = new NodeCache({ stdTTL: 3600 });
  }

  _isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return typeof uuid === 'string' && uuidRegex.test(uuid);
  }

  async _ensureUserExists(userId) {
    if (!this._isValidUUID(userId)) return false;
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        await userRepository.create({ id: userId });
      }
      return true;
    } catch (error) {
      console.error('Failed to ensure user exists:', error.message);
      return false;
    }
  }

  
//Memprediksi/Merekomendasikan karir berdasarkan bidang minat. Jika AI gagal/timeout, sistem otomatis mengeksekusi _fallbackPredictInterest.
  async predictInterest(interestId, userId = null) {
    let result;
    const normalizedInterestId = this._normalizeInterestId(interestId);
    const cacheKey = `ai:interest:${normalizedInterestId}`;

    try {
      let aiData = this.cache.get(cacheKey);

      if (aiData) {
        console.log(`⚡ [Cache Hit] predictInterest: ${normalizedInterestId}`);
      } else {
        console.log(`⏳ [Cache Miss] predictInterest: ${normalizedInterestId}`);
        const aiResponse = await axios.post(`${this.aiServiceUrl}/predict`, {
          user_id: userId || 'anonymous',
          method: 'interest',
          payload: { interest_id: normalizedInterestId }
        }, {
          timeout: this.aiTimeout,
          headers: { 'Content-Type': 'application/json' }
        });

        aiData = aiResponse.data;
        // Simpan ke cache jika AI berhasil menjawab
        if (aiData.status === 'success') {
          this.cache.set(cacheKey, aiData);
        }
      }

      // Tetap simpan riwayat tes ke database jika userId adalah UUID yang valid
      if (this._isValidUUID(userId)) {
        await this._ensureUserExists(userId);
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
    if (this._isValidUUID(userId)) {
      await this._ensureUserExists(userId);
      await this._storeUserOutput(userId, 'interest', { interest_id: normalizedInterestId }, enriched);
    }
    return enriched;
  }

//Memprediksi karir berdasarkan keahlian (Skill) user. Jika cache kosong, ia memanggil API AI. Jika AI gagal, fallback ke database lokal.
  async predictSkill(selectedSkills, selectedFields = [], userId = null) {
    let result;
    const skills = Array.isArray(selectedSkills) ? selectedSkills : [];
    const fields = Array.isArray(selectedFields) ? selectedFields : [];
    
    // Sort array agar urutan input tidak mempengaruhi cache (A,B sama dengan B,A)
    const cacheKey = `ai:skill:${[...skills].sort().join(',')}:${[...fields].sort().join(',')}`;

    try {
      let aiData = this.cache.get(cacheKey);

      if (aiData) {
        console.log(`⚡ [Cache Hit] predictSkill: ${cacheKey}`);
      } else {
        console.log(`⏳ [Cache Miss] predictSkill: ${cacheKey}`);
        const aiResponse = await axios.post(`${this.aiServiceUrl}/predict`, {
          user_id: userId || 'anonymous',
          method: 'skill',
          payload: { skills, selected_fields: fields }
        }, {
          timeout: this.aiTimeout,
          headers: { 'Content-Type': 'application/json' }
        });

        aiData = aiResponse.data;
        if (aiData.status === 'success') {
          this.cache.set(cacheKey, aiData);
        }
      }

      if (this._isValidUUID(userId)) {
        await this._ensureUserExists(userId);
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
    if (this._isValidUUID(userId)) {
      await this._ensureUserExists(userId);
      await this._storeUserOutput(userId, 'skill', { skills, selected_fields: fields }, enriched);
    }
    return enriched;
  }

//Memprediksi karir berdasarkan kepribadian tipe RIASEC. Mengirim payload skor RIASEC ke AI untuk dikonversi menjadi rekomendasi karir.
  async predictRiasec(payload, userId = null) {
    let result;
    const scores = this._normalizeRiasecPayload(payload);
    
    // Cache key berdasarkan kombinasi nilai skor
    const cacheKey = `ai:riasec:${JSON.stringify(scores)}`;

    try {
      let aiData = this.cache.get(cacheKey);

      if (aiData) {
        console.log(`⚡ [Cache Hit] predictRiasec: ${cacheKey}`);
      } else {
        console.log(`⏳ [Cache Miss] predictRiasec: ${cacheKey}`);
        const aiResponse = await axios.post(`${this.aiServiceUrl}/predict`, {
          user_id: userId || 'anonymous',
          method: 'riasec',
          payload: { riasec_scores: scores }
        }, {
          timeout: this.aiTimeout,
          headers: { 'Content-Type': 'application/json' }
        });

        aiData = aiResponse.data;
        if (aiData.status === 'success') {
          this.cache.set(cacheKey, aiData);
        }
      }

      if (this._isValidUUID(userId)) {
        await this._ensureUserExists(userId);
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
    if (this._isValidUUID(userId)) {
      await this._ensureUserExists(userId);
      await this._storeUserOutput(userId, 'riasec', { riasec_scores: scores }, enriched);
    }
    return enriched;
  }


//Mengambil data mentah (hanya berisi ID Role dan skor) dari AI, kemudian menggabungkannya dengan data terperinci dari Database Lokal PostgreSQL 
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
      const safeRoleDetail = roleDetail || {};

      const normalized = this._normalizeRecommendation(item);
      const aiDesc = (normalized.description || '').trim();
      const aiSalary = (normalized.salary_range || '').trim();
      
      normalized.description = safeRoleDetail.description || aiDesc || 'Deskripsi terperinci untuk peran ini sedang dalam pembaruan. Secara umum, peran ini sangat relevan dengan profil dan keahlian Anda.';
      normalized.salary_range = safeRoleDetail.salary_range || aiSalary || 'Menyesuaikan rata-rata standar industri';
      normalized.skill_relevant = Array.isArray(normalized.skill_relevant) && normalized.skill_relevant.length
        ? normalized.skill_relevant
        : (safeRoleDetail.Skills || []).map(skill => skill.name);
      normalized.roadmap = this._buildRoadmap(safeRoleDetail, normalized.roadmap);

      return normalized;
    });
  }

  //normalisasi data rekomendasi
  _normalizeRecommendation(item) {
    const roadmap = item.roadmap || {};
    const learning_path = roadmap.learning_path || item.learning_path || [];
    const dummy_projects = roadmap.dummy_projects || item.dummy_projects || [];

    return {
      role_id: item.role_id || null,
      role_name: item.role_name || item.name || null,
      match_pct: item.match_pct != null ? item.match_pct : null,
      description: item.description || null,
      salary_range: item.salary_range || null,
      skill_relevant: Array.isArray(item.skill_relevant) ? item.skill_relevant : [],
      skill_gap: Array.isArray(item.skill_gap) ? item.skill_gap : [],
      roadmap: { learning_path, dummy_projects }
    };
  }

//Membangun struktur roadmap pembelajaran dan dummy proyek dari data Role.
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
        if (!project) return null;
        return {
          project_id: project.project_id,
          judul: project.judul_project,
          brief_case: project.brief_case,
          instructions: project.instructions,
          tools_used: project.tools_used
        };
      })
      .filter(Boolean);

    const normalizeLearningPath = (path) => {
      if (!Array.isArray(path)) return [];
      return path.map((item, idx) => {
        let platformName = item.platform || 'Online Platform';
        if (!item.platform && item.resource) {
          if (item.resource.includes('coursera')) platformName = 'Coursera';
          else if (item.resource.includes('dicoding')) platformName = 'Dicoding';
          else if (item.resource.includes('udemy')) platformName = 'Udemy';
          else if (item.resource.includes('edx')) platformName = 'edX';
        }
        return {
          step: item.step || item.step_number || (idx + 1),
          nama_skill: item.nama_skill || item.title || item.course_name || 'Materi Pembelajaran',
          link_course: item.link_course || (item.resource && item.resource.startsWith('http') ? item.resource : '#'),
          tipe: item.tipe || item.type || 'Course',
          platform: platformName,
          title: item.nama_skill || item.title || 'Materi Pembelajaran',
          resource: item.platform || item.resource || 'Platform'
        };
      });
    };

    const normalizeDummyProjects = (projects) => {
      if (!Array.isArray(projects)) return [];
      return projects.map((p, idx) => {
        if (typeof p === 'string') {
          return {
            project_id: `dummy_${idx}`,
            judul: p,
            brief_case: 'Sebuah proyek praktikal untuk mengaplikasikan kemampuan Anda pada studi kasus nyata.',
            instructions: 'Lakukan analisis kebutuhan;Implementasikan solusi;Lakukan testing',
            tools_used: 'Standard Tools'
          };
        }
        return {
          project_id: p.project_id || p.id || `dummy_${idx}`,
          judul: p.judul || p.project_name || p.title || 'Proyek Tanpa Judul',
          brief_case: p.brief_case || p.description || 'Deskripsi tidak tersedia.',
          instructions: p.instructions || p.tasks || 'Ikuti panduan standar.',
          tools_used: p.tools_used || p.tools || 'Tidak disebutkan'
        };
      });
    };

    return {
      learning_path: learningPath.length ? learningPath : normalizeLearningPath(existingRoadmap.learning_path),
      dummy_projects: dummyProjects.length ? dummyProjects : normalizeDummyProjects(existingRoadmap.dummy_projects)
    };
  }

//Membangun data chart untuk divisualisasikan di frontend
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

//Menormalisasi format input skor RIASEC dari berbagai bentuk payload frontend
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

//Mengonversi string ID Minat Karir (seperti 'it_software') menjadi format standar Field ID ('F01', 'F02', dll) yang dikenali oleh database lokal.
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


//Menyimpan hasil akhir (output) rekomendasi ke dalam tabel riwayat user, yang nantinya memungkinkan sistem untuk melacak hasil tes pengguna anonim berdasarkan UUID unik mereka.
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


//Fallback untuk prediksi Minat Karir. Menarik role berdasarkan bidang minat.
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


//Fallback untuk prediksi Skill. Mengambil role secara statis.

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
          learning_path: [],
          dummy_projects: []
        }
      }))
    };
  }

//Fallback untuk prediksi RIASEC. Mencari role yang memiliki skor terdekat.
  async _fallbackPredictRiasec(scores, userId = null) {
    const roles = await roleRepository.findByRiasecScores(scores);

    // Compute interest_code from top 3 scores
    const sortedScores = Object.entries(scores || {})
      .sort((a, b) => (b[1] || 0) - (a[1] || 0))
      .slice(0, 3)
      .map(entry => entry[0].charAt(0).toUpperCase());
    const interestCode = sortedScores.join('') || 'RIA';

    return {
      interest_code: interestCode,
      sector_recommendations: [
        { field_name: "Teknologi & Bisnis", relevance_pct: 95 },
        { field_name: "Desain & Kreatif", relevance_pct: 85 }
      ],
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
        skill_relevant: [],
        skill_gap: [],
        roadmap: {
          learning_path: [],
          dummy_projects: []
        }
      }))
    };
  }
}

module.exports = new RecommendationService();