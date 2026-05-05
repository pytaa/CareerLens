// src/pages/AnalisisSkill/AnalisisSkill.jsx
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import SkillSelection from './SkillSelection';
import SkillResult from './SkillResult';

const AnalisisSkill = () => {
  const [view, setView] = useState('selection');
  const [resultData, setResultData] = useState(null);
  
  // State baru untuk menyimpan skill yang diketik user
  const [inputtedSkills, setInputtedSkills] = useState([]);

  const handleAnalyzeSkill = async (skillsArray) => {
    setInputtedSkills(skillsArray); // kita simpan input user untuk ditampilkan di sidebar Result
    setView('result');

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: "user_anonim_123",
          method: "skill",
          payload: { skills: skillsArray }
        })
      });

      const jsonResponse = await response.json();

      if (jsonResponse.status === 'success') {
        setResultData(jsonResponse.data);
      } else {
        alert("Gagal menganalisis: " + jsonResponse.message);
        setView('selection');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Terjadi kesalahan koneksi ke server.");
      setView('selection');
    }
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] font-sans flex flex-col">
      {view === 'selection' ? (
        <SkillSelection onAnalyze={handleAnalyzeSkill} />
      ) : (
        <SkillResult data={resultData} inputtedSkills={inputtedSkills} />
      )}
    </div>
  );
};

export default AnalisisSkill;