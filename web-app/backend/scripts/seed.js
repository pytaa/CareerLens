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
} = require('../models');

const datasetPath = path.join(__dirname, '../../..', 'dataset');

const readCSV = (fileName, rowTransformer = (row) => row) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(datasetPath, fileName);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`! File not found: ${fileName}, skipping...`);
      return resolve([]);
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(rowTransformer(data)))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

async function seedDatabase() {
  try {
    console.log('--- Starting CareerLens Database Seeding ---\n');

    console.log('Step 1: Seeding Fields...');
    const fieldsData = await readCSV('fields.csv');
    await Fields.bulkCreate(fieldsData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${fieldsData.length} fields\n`);

    console.log('Step 2: Seeding Roles (RIASEC)...');
    const rolesData = await readCSV('roles.csv', (row) => ({
      ...row,
      R: parseFloat(row.R) || 0,
      I: parseFloat(row.I) || 0,
      A: parseFloat(row.A) || 0,
      S: parseFloat(row.S) || 0,
      E: parseFloat(row.E) || 0,
      C: parseFloat(row.C) || 0,
    }));
    await Roles.bulkCreate(rolesData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${rolesData.length} roles\n`);

    console.log('Step 3: Seeding Master Roles...');
    const masterRolesData = await readCSV('master_roles.csv');
    await MasterRoles.bulkCreate(masterRolesData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${masterRolesData.length} master roles\n`);

    console.log('Step 4: Seeding Test Questions...');
    const testQuestionsData = await readCSV('test_question.csv');
    await TestQuestions.bulkCreate(testQuestionsData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${testQuestionsData.length} test questions\n`);

    console.log('Step 5: Seeding Learning Resources...');
    const learningResourcesData = await readCSV('learning_resources.csv');
    await LearningResources.bulkCreate(learningResourcesData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${learningResourcesData.length} learning resources\n`);

    console.log('Step 6: Seeding Dummy Projects...');
    const dummyProjectsData = await readCSV('dummy_projects.csv');
    await DummyProjects.bulkCreate(dummyProjectsData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${dummyProjectsData.length} dummy projects\n`);

    console.log('Step 7: Seeding Project Role Mappings...');
    const projectRoleMappingData = await readCSV('project_role_mapping.csv');
    await ProjectRoleMapping.bulkCreate(projectRoleMappingData, { ignoreDuplicates: true });
    console.log(`✓ Seeded ${projectRoleMappingData.length} project role mappings\n`);

    console.log('--- Database Seeding Completed Successfully! ---');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
}

sequelize.sync({ alter: true })
  .then(() => seedDatabase())
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

