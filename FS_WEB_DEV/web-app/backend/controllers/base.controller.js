 //Menyediakan implementasi fungsi CRUD (Create, Read, Update, Delete)
class BaseController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res, next) {
    try {
      const data = await this.service.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await this.service.getById(id);
      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = await this.service.update(id, req.body);
      if (!data) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await this.service.delete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BaseController;