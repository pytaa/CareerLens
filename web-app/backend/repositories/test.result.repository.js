const BaseRepository = require('./base.repository');
const { TestResult } = require('../models');

class TestResultRepository extends BaseRepository {
  constructor() {
    super(TestResult);
  }

  async findByUserId(userId) {
    return await this.findAll({ where: { user_id: userId } });
  }

  async findByTestName(testName) {
    return await this.findAll({ where: { test_name: testName } });
  }
}

module.exports = new TestResultRepository();