require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Client } = require('pg');

let sequelize, CareerField, IndustryCategory, Role, Skill, RoleSkill, LearningResource, DummyProject, RoleProjectMapping;

// Fungsi ini bertujuan untuk mengecek apakah database dengan nama yang ditentukan
// sudah ada. Jika belum ada, maka database tersebut akan dibuat secara otomatis.
const ensureDatabaseExists = async () => {
  const dbName = process.env.DB_NAME || 'careerlens';
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres'
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbName}'`);
    if (res.rowCount === 0) {
      console.log(`Database ${dbName} not found, creating it...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database ${dbName} created successfully.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (error) {
    console.error('Error ensuring database exists:', error);
  } finally {
    await client.end();
  }
};

const datasetPath = path.join(__dirname, '../../../dataset');

// Helper function to read CSV
const readCSV = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return [];
  }
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

// Seed career fields
const seedCareerFields = async () => {
  const fields = [
    { field_id: 'F01', name: 'Teknologi Informasi & Software Development', description: 'Perangkat lunak, cloud, dan sistem digital.', sort_order: 1 },
    { field_id: 'F02', name: 'Data Science & Artificial Intelligence', description: 'Analitik data, machine learning, dan AI.', sort_order: 2 },
    { field_id: 'F03', name: 'Desain Kreatif & UI/UX', description: 'Pengalaman pengguna dan desain produk digital.', sort_order: 3 },
    { field_id: 'F04', name: 'Digital Marketing & Analytics', description: 'Pemasaran digital berbasis data dan pertumbuhan.', sort_order: 4 }
  ];
  await CareerField.bulkCreate(fields);
  console.log('Career fields seeded');
};

// Seed industry categories
const seedIndustryCategories = async () => {
  const categories = [
    { slug: 'it_software', field_id: 'F01', display_title: 'Teknologi Informasi & Software Development' },
    { slug: 'data_science', field_id: 'F02', display_title: 'Data Science & Artificial Intelligence' },
    { slug: 'design_uiux', field_id: 'F03', display_title: 'Desain Kreatif & UI/UX Design' },
    { slug: 'digital_marketing', field_id: 'F04', display_title: 'Digital Marketing & Analytics' }
  ];
  await IndustryCategory.bulkCreate(categories);
  console.log('Industry categories seeded');
};

// Seed roles
const seedRoles = async () => {
  const rolesData = await readCSV(path.join(datasetPath, 'roles.csv'));
  console.log(`Read ${rolesData.length} roles from CSV`);
  if (rolesData.length > 0) {
    console.log('Sample row:', JSON.stringify(rolesData[0]));
  }
  const roles = rolesData.map(row => ({
    role_id: row.role_id,
    field_id: row.field_id,
    role_name: row.role_name,
    riasec_r: parseFloat(row.R),
    riasec_i: parseFloat(row.I),
    riasec_a: parseFloat(row.A),
    riasec_s: parseFloat(row.S),
    riasec_e: parseFloat(row.E),
    riasec_c: parseFloat(row.C)
  }));
  await Role.bulkCreate(roles);
  console.log('Roles seeded');
};

// Seed skills (from master_roles.csv)
const seedSkills = async () => {
  const rolesData = await readCSV(path.join(datasetPath, 'master_roles.csv'));
  const skillSet = new Set();
  
  rolesData.forEach(row => {
    if (row.skill) {
      row.skill.split(',').forEach(s => {
        const trimmed = s.trim();
        if (trimmed) skillSet.add(trimmed);
      });
    }
  });

  const skills = Array.from(skillSet).map(name => ({ name }));
  await Skill.bulkCreate(skills, { ignoreDuplicates: true });
  console.log(`Seeded ${skills.length} unique skills`);
};

// Seed role skills (from master_roles.csv)
const seedRoleSkills = async () => {
  const rolesData = await readCSV(path.join(datasetPath, 'master_roles.csv'));
  const allSkills = await Skill.findAll();
  const skillMap = {};
  allSkills.forEach(s => {
    skillMap[s.name.toLowerCase()] = s.id;
  });

  const roleSkills = [];
  rolesData.forEach(row => {
    if (row.skill && row.role_id) {
      row.skill.split(',').forEach(s => {
        const trimmed = s.trim().toLowerCase();
        const skillId = skillMap[trimmed];
        if (skillId) {
          roleSkills.push({
            role_id: row.role_id,
            skill_id: skillId,
            weight: 1.0 
          });
        }
      });
    }
  });

  await RoleSkill.bulkCreate(roleSkills, { ignoreDuplicates: true });
  console.log(`Seeded ${roleSkills.length} role-skill associations`);
};

// Seed learning resources
const seedLearningResources = async () => {
  const lrData = await readCSV(path.join(datasetPath, 'learning_resources.csv'));
  const resources = lrData.map(row => ({
    role_id: row.role_id,
    step_number: parseInt(row.step_number),
    nama_skill: row.nama_skill,
    link_course: row.link_course,
    tipe: row.tipe,
    platform: row.platform
  }));
  await LearningResource.bulkCreate(resources);
  console.log('Learning resources seeded');
};

// Seed dummy projects
const seedDummyProjects = async () => {
  const projectsData = await readCSV(path.join(datasetPath, 'dummy_projects.csv'));
  const projects = projectsData.map(row => ({
    project_id: row.project_id,
    judul_project: row.judul_project,
    brief_case: row.brief_case,
    instructions: row.instructions,
    tools_used: row.tools_used
  }));
  await DummyProject.bulkCreate(projects);
  console.log('Dummy projects seeded');
};

// Seed role project mapping
const seedRoleProjectMapping = async () => {
  const mappingData = await readCSV(path.join(datasetPath, 'project_role_mapping.csv'));
  const mappings = mappingData.map(row => ({
    role_id: row.role_id,
    project_id: row.project_id,
    sort_order: parseInt(row.sort_order) || 0
  }));
  await RoleProjectMapping.bulkCreate(mappings);
  console.log('Role project mappings seeded');
};

// Main seed function
const seedDatabase = async () => {
  try {
    await ensureDatabaseExists();

    const models = require('../models');
    sequelize = models.sequelize;
    CareerField = models.CareerField;
    IndustryCategory = models.IndustryCategory;
    Role = models.Role;
    Skill = models.Skill;
    RoleSkill = models.RoleSkill;
    LearningResource = models.LearningResource;
    DummyProject = models.DummyProject;
    RoleProjectMapping = models.RoleProjectMapping;

    console.log('Syncing database...');
    const forceSync = process.env.NODE_ENV !== 'production' || process.env.FORCE_DB_SYNC === 'true';
    if (forceSync) {
      console.warn('WARNING: Running with force: true. This will drop all existing tables!');
    }
    await sequelize.sync({ force: forceSync });
    console.log('Database synced');

    await seedCareerFields();
    await seedIndustryCategories();
    await seedRoles();
    await seedSkills();
    await seedLearningResources();
    await seedDummyProjects();
    await seedRoleProjectMapping();
    await seedRoleSkills();
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;