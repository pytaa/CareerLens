const { Roles, MasterRoles, LearningResources, DummyProjects, ProjectRoleMapping } = require('../models');
const {
  cosineSimilarity,
  riasecScoresToArray,
  calculateSkillMatchScore,
  calculateFinalRelevanceScore,
} = require('./scoring.service');

// Get recommendations berdasarkan RIASEC scores dan skills
async function getRecommendations(riasecScores, selectedSkills, selectedFields) {
  try {
    // Fetch semua roles
    let rolesQuery = Roles.findAll({
      include: [{ model: MasterRoles, attributes: ['deskripsi', 'skill', 'estimated_salary'] }],
    });

    if (selectedFields && selectedFields.length > 0) {
      rolesQuery = Roles.findAll({
        where: { field_id: selectedFields },
        include: [{ model: MasterRoles, attributes: ['deskripsi', 'skill', 'estimated_salary'] }],
      });
    } else {
      rolesQuery = Roles.findAll({
        include: [{ model: MasterRoles, attributes: ['deskripsi', 'skill', 'estimated_salary'] }],
      });
    }

    const roles = await rolesQuery;

    if (!roles || roles.length === 0) {
      return [];
    }

    // Hitung relevance score untuk setiap role
    const recommendations = roles
      .map(role => {
        const userRiasecArray = riasecScoresToArray(riasecScores);
        const roleRiasecArray = riasecScoresToArray({
          R: role.R,
          I: role.I,
          A: role.A,
          S: role.S,
          E: role.E,
          C: role.C,
        });

        const riasecScore = cosineSimilarity(userRiasecArray, roleRiasecArray);
        const skillScore = calculateSkillMatchScore(
          selectedSkills || [],
          role.MasterRole?.skill || ''
        );

        const relevanceScore = calculateFinalRelevanceScore(skillScore, riasecScore);

        return {
          role_id: role.role_id,
          role_name: role.role_name,
          field_id: role.field_id,
          deskripsi: role.MasterRole?.deskripsi,
          estimated_salary: role.MasterRole?.estimated_salary,
          required_skills: role.MasterRole?.skill?.split(',').map(s => s.trim()) || [],
          relevance_score: Math.round(relevanceScore * 100) / 100,
          skill_match_score: Math.round(skillScore * 100) / 100,
          riasec_match_score: Math.round(riasecScore * 100) / 100,
        };
      })
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 5); // Return only top 5 recommendations

    return recommendations;
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    throw error;
  }
}

// Get role recommendations berdasarkan skill input
async function getRecommendationsBySkill(selectedSkills, selectedFields) {
  try {
    let rolesQuery = {};

    if (selectedFields && selectedFields.length > 0) {
      rolesQuery = Roles.findAll({
        where: { field_id: selectedFields },
        include: [{ model: MasterRoles, attributes: ['deskripsi', 'skill', 'estimated_salary'] }],
      });
    } else {
      rolesQuery = Roles.findAll({
        include: [{ model: MasterRoles, attributes: ['deskripsi', 'skill', 'estimated_salary'] }],
      });
    }

    const roles = await rolesQuery;

    const recommendations = roles
      .map(role => {
        const skillScore = calculateSkillMatchScore(
          selectedSkills || [],
          role.MasterRole?.skill || ''
        );

        return {
          role_id: role.role_id,
          role_name: role.role_name,
          field_id: role.field_id,
          deskripsi: role.MasterRole?.deskripsi,
          estimated_salary: role.MasterRole?.estimated_salary,
          required_skills: role.MasterRole?.skill?.split(',').map(s => s.trim()) || [],
          relevance_score: Math.round(skillScore * 100) / 100,
        };
      })
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 5); // Return only top 5 recommendations

    return recommendations;
  } catch (error) {
    console.error('Error in getRecommendationsBySkill:', error);
    throw error;
  }
}

module.exports = {
  getRecommendations,
  getRecommendationsBySkill,
};
