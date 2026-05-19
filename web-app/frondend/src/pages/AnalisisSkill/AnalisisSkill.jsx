import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID
import Navbar from '../../components/Navbar';
import SkillSelection from './SkillSelection';
import SkillResult from './SkillResult';

const AnalisisSkill = () => {
  const [view, setView] = useState('selection');
  const [resultData, setResultData] = useState(null);
  
  // State untuk menyimpan skill yang diketik user
  const [inputtedSkills, setInputtedSkills] = useState([]);

  // membuat atau mengambil ID Anonim dari peramban
  const getOrCreateUserId = () => {
    let userId = localStorage.getItem('careerlens_user_id');
    if (!userId) {
      userId = `user_${uuidv4()}`;
      localStorage.setItem('careerlens_user_id', userId);
    }
    return userId;
  };

  const handleAnalyzeSkill = async (skillsArray) => {
    setInputtedSkills(skillsArray); // simpan input user untuk ditampilkan di sidebar
    setView('result');

    try {
      const currentUserId = getOrCreateUserId();

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUserId, 
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