const BaseService = require('./base.service');
const userRepository = require('../repositories/user.repository');
const testResultRepository = require('../repositories/test.result.repository');
const userOutputRepository = require('../repositories/user.output.repository');

class UserService extends BaseService {
  constructor() {
    super(userRepository);
  }

  /**
   * Mengambil seluruh riwayat pengguna berdasarkan ID. Riwayat mencakup hasil tes (test_results) dan rekomendasi yang pernah dihasilkan (user_outputs).
   */
  async getUserHistory(userId) {
    const testResults = await testResultRepository.findByUserId(userId);
    const userOutputs = await userOutputRepository.findByUserId(userId);

    return {
      test_results: testResults,
      user_outputs: userOutputs
    };
  }

  /**
   * Menyimpan output spesifik pengguna (misalnya saat pengguna menyimpan hasil rekomendasi karir).
   * @param {string} userId 
   * @param {string} outputType 
   * @param {object} outputValue 
   * @param {object} context 
   */
  async saveUserOutput(userId, outputType, outputValue, context = {}) {
    return await userOutputRepository.create({
      user_id: userId,
      output_type: outputType,
      output_value: outputValue,
      context
    });
  }
}

module.exports = new UserService();