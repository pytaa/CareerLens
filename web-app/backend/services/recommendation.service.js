const { Roles, MasterRoles, LearningResources, DummyProjects } = require('../models');
const { getAIPrediction } = require('./ai.service');

async function getRecommendations(riasecScores, selectedSkills, selectedFields) {
  try {
    const aiResults = await getAIPrediction('riasec', {
      riasec_scores: riasecScores,
      skills: selectedSkills,
      fields: selectedFields
    });

    return await enrichRecommendationData(aiResults);
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    throw error;
  }
}

async function getRecommendationsBySkill(selectedSkills, selectedFields) {
  try {
    const aiResults = await getAIPrediction('skill', {
      skills: selectedSkills,
      fields: selectedFields
    });

    return await enrichRecommendationData(aiResults);
  } catch (error) {
    console.error('Error in getRecommendationsBySkill:', error);
    throw error;
  }
}

async function enrichRecommendationData(aiResults) {
  const { recommendations, chart_data } = aiResults;

  const enrichedRecommendations = await Promise.all(
    recommendations.map(async (rec) => {
      const roleDetail = await Roles.findOne({
        where: { role_id: rec.role_id },
        include: [
          {
            model: MasterRoles,
            include: [
              { model: LearningResources },
              { model: DummyProjects }
            ]
          }
        ]
      });

      if (!roleDetail) {
        return {
          ...rec,
          roadmap: { learning_path: [], dummy_projects: [] }
        };
      }

      return {
        role_id: rec.role_id,
        role_name: rec.role_name || roleDetail.role_name,
        match_pct: rec.match_pct || 0,
        description: rec.description || roleDetail.MasterRole?.deskripsi,
        salary_range: rec.salary_range || roleDetail.MasterRole?.estimated_salary,
        skill_gap: rec.skill_gap || [],
        roadmap: {
          learning_path: roleDetail.MasterRole?.LearningResources?.map(lr => ({
            step: lr.step_number,
            title: lr.nama_skill,
            resource: lr.platform,
            link: lr.link_course
          })).sort((a, b) => a.step - b.step) || [],
          dummy_projects: roleDetail.MasterRole?.DummyProjects?.map(dp => dp.judul_project) || []
        }
      };
    })
  );

  return {
    recommendations: enrichedRecommendations,
    chart_data: chart_data
  };
}

module.exports = {
  getRecommendations,
  getRecommendationsBySkill,
};

