const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const sequelize = require('../config/database');
const {
  Fields,
  Roles,
  MasterRoles,
  TestQuestions,
  LearningResources,
  DummyProjects,
  ProjectRoleMapping,
  Salary,
} = require('../models');

const datasetPath = path.join(__dirname, '../../..', 'dataset');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...\n');

    // 1. Seed Fields
    console.log('Seeding Fields...');
    const fieldsData = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(datasetPath, 'fields.csv'))
        .pipe(csv())
        .on('data', (row) => fieldsData.push(row))
        .on('end', resolve)
        .on('error', reject);
    });
    await Fields.bulkCreate(fieldsData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${fieldsData.length} fields\n`);

    // 2. Seed Roles
    console.log('Seeding Roles...');
    const rolesData = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(datasetPath, 'roles.csv'))
        .pipe(csv())
        .on('data', (row) => {
          rolesData.push({
            role_id: row.role_id,
            field_id: row.field_id,
            role_name: row.role_name,
            R: parseFloat(row.R),
            I: parseFloat(row.I),
            A: parseFloat(row.A),
            S: parseFloat(row.S),
            E: parseFloat(row.E),
            C: parseFloat(row.C),
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });
    await Roles.bulkCreate(rolesData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${rolesData.length} roles\n`);

    // 3. Seed Master Roles
    console.log('Seeding Master Roles...');
    const masterRolesData = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(datasetPath, 'master_roles.csv'))
        .pipe(csv())
        .on('data', (row) => masterRolesData.push(row))
        .on('end', resolve)
        .on('error', reject);
    });
    await MasterRoles.bulkCreate(masterRolesData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${masterRolesData.length} master roles\n`);

    // 4. Seed Test Questions
    console.log('Seeding Test Questions...');
    const testQuestionsData = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(datasetPath, 'test_question.csv'))
        .pipe(csv())
        .on('data', (row) => testQuestionsData.push(row))
        .on('end', resolve)
        .on('error', reject);
    });
    await TestQuestions.bulkCreate(testQuestionsData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${testQuestionsData.length} test questions\n`);

    // 5. Seed Learning Resources
    console.log('Seeding Learning Resources...');
    const learningResourcesData = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(datasetPath, 'learning_resources.csv'))
        .pipe(csv())
        .on('data', (row) => learningResourcesData.push(row))
        .on('end', resolve)
        .on('error', reject);
    });
    await LearningResources.bulkCreate(learningResourcesData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${learningResourcesData.length} learning resources\n`);

    // 6. Seed Dummy Projects
    console.log('Seeding Dummy Projects...');
    const dummyProjectsData = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(datasetPath, 'dummy_projects.csv'))
        .pipe(csv())
        .on('data', (row) => dummyProjectsData.push(row))
        .on('end', resolve)
        .on('error', reject);
    });
    await DummyProjects.bulkCreate(dummyProjectsData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${dummyProjectsData.length} dummy projects\n`);

    // 7. Seed Project Role Mapping
    console.log('Seeding Project Role Mappings...');
    const projectRoleMappingData = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(datasetPath, 'project_role_mapping.csv'))
        .pipe(csv())
        .on('data', (row) => projectRoleMappingData.push(row))
        .on('end', resolve)
        .on('error', reject);
    });
    await ProjectRoleMapping.bulkCreate(projectRoleMappingData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${projectRoleMappingData.length} project role mappings\n`);

    // 8. Seed Salary
    console.log('Seeding Salary Data...');
    const salaryData = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(datasetPath, 'salary.csv'))
        .pipe(csv())
        .on('data', (row) => salaryData.push(row))
        .on('end', resolve)
        .on('error', reject);
    });
    await Salary.bulkCreate(salaryData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${salaryData.length} salary records\n`);

    console.log('✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
sequelize.sync({ force: false })
  .then(() => seedDatabase())
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
