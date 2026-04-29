const { LearningResources, DummyProjects, ProjectRoleMapping, MasterRoles } = require('../models');

// Get roadmap lengkap untuk role tertentu
async function getRoadmapForRole(roleId) {
  try {
    // Get role details
    const role = await MasterRoles.findByPk(roleId);
    if (!role) {
      throw new Error('Role tidak ditemukan');
    }

    // Get learning resources terstruktur per step
    const learningResources = await LearningResources.findAll({
      where: { role_id: roleId },
      order: [['step_number', 'ASC']],
    });

    // Group resources by step
    const learningSteps = {};
    learningResources.forEach(resource => {
      const step = resource.step_number;
      if (!learningSteps[step]) {
        learningSteps[step] = {
          step_number: step,
          skills: [],
          resources: [],
        };
      }
      if (resource.nama_skill && !learningSteps[step].skills.includes(resource.nama_skill)) {
        learningSteps[step].skills.push(resource.nama_skill);
      }
      learningSteps[step].resources.push({
        resource_id: resource.resource_id,
        nama_skill: resource.nama_skill,
        link_course: resource.link_course,
        tipe: resource.tipe,
        platform: resource.platform,
      });
    });

    const stepsArray = Object.values(learningSteps).sort((a, b) => a.step_number - b.step_number);

    // Get dummy projects untuk role ini
    const projectMappings = await ProjectRoleMapping.findAll({
      where: { role_id: roleId },
      include: [{ model: DummyProjects }],
    });

    const dummyProjects = projectMappings.map(pm => ({
      project_id: pm.DummyProject.project_id,
      judul_project: pm.DummyProject.judul_project,
      brief_case: pm.DummyProject.brief_case,
      instructions: pm.DummyProject.instructions,
      tools_used: pm.DummyProject.tools_used?.split(',').map(t => t.trim()) || [],
    }));

    return {
      role_id: roleId,
      role_name: role.role_name,
      deskripsi: role.deskripsi,
      estimated_salary: role.estimated_salary,
      required_skills: role.skill?.split(',').map(s => s.trim()) || [],
      learning_steps: stepsArray,
      dummy_projects: dummyProjects,
    };
  } catch (error) {
    console.error('Error in getRoadmapForRole:', error);
    throw error;
  }
}

module.exports = {
  getRoadmapForRole,
};
