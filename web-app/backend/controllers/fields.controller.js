const fs = require('fs');
const path = require('path');
const { Fields, LearningResources } = require('../models');

exports.getFields = async (req, res, next) => {
  try {
    const fields = await Fields.findAll({
      order: [['field_id', 'ASC']]
    });
    res.json({
      status: 'success',
      data: fields
    });
  } catch (error) {
    next(error);
  }
};

exports.getSkills = async (req, res, next) => {
  try {
    let allSkills = new Set();

    const txtPath = path.join(__dirname, '../../../dataset/uncleaned/daftar_skill_unik_careerlens.txt');
    if (fs.existsSync(txtPath)) {
      const txtContent = fs.readFileSync(txtPath, 'utf8');
      txtContent.split('\n').forEach(skill => {
        const cleaned = skill.trim();
        if (cleaned) allSkills.add(cleaned);
      });
    }

    const dbSkills = await LearningResources.findAll({
      attributes: ['nama_skill'],
      raw: true
    });

    dbSkills.forEach(row => {
      if (row.nama_skill) {
        row.nama_skill.split(',').forEach(s => {
          const cleaned = s.trim();
          if (cleaned) allSkills.add(cleaned);
        });
      }
    });

    const uniqueSkillsList = Array.from(allSkills)
      .filter((v, i, a) => a.findIndex(t => t.toLowerCase() === v.toLowerCase()) === i)
      .sort((a, b) => a.localeCompare(b));

    res.json({
      status: 'success',
      count: uniqueSkillsList.length,
      data: uniqueSkillsList
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
