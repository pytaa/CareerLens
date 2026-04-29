// Perhitungan Similarity menggunakan Cosine Similarity
function cosineSimilarity(vector1, vector2) {
  const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  return (dotProduct / (magnitude1 * magnitude2)) * 100;
}

// Convert RIASEC scores object ke array [R, I, A, S, E, C]
function riasecScoresToArray(scores) {
  return [scores.R || 0, scores.I || 0, scores.A || 0, scores.S || 0, scores.E || 0, scores.C || 0];
}

// Hitung relevansi skill user dengan skill yang dibutuhkan role
function calculateSkillMatchScore(userSkills, roleSkills) {
  if (!roleSkills || roleSkills.length === 0) return 0;

  const roleSkillsArray = roleSkills
    .split(',')
    .map(skill => skill.trim().toLowerCase());

  const matchingSkills = userSkills.filter(userSkill =>
    roleSkillsArray.some(roleSkill =>
      roleSkill.includes(userSkill.toLowerCase()) ||
      userSkill.toLowerCase().includes(roleSkill)
    )
  );

  return (matchingSkills.length / roleSkillsArray.length) * 100;
}

// Final relevance score calculation
function calculateFinalRelevanceScore(skillScore, riasecScore) {
  // Weighted average: 60% dari skill, 40% dari RIASEC
  return (skillScore * 0.6) + (riasecScore * 0.4);
}

module.exports = {
  cosineSimilarity,
  riasecScoresToArray,
  calculateSkillMatchScore,
  calculateFinalRelevanceScore,
};
