class BaseService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll(options = {}) {
    return await this.repository.findAll(options);
  }

  async getById(id, options = {}) {
    return await this.repository.findById(id, options);
  }

  async create(data, options = {}) {
    return await this.repository.create(data, options);
  }

  async update(id, data, options = {}) {
    return await this.repository.update(id, data, options);
  }

  async delete(id, options = {}) {
    return await this.repository.delete(id, options);
  }

  async count(options = {}) {
    return await this.repository.count(options);
  }
}

module.exports = BaseService;