import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../../components/Navbar';
import SkillSelection from './SkillSelection';
import SkillResult from './SkillResult';

const AnalisisSkill = () => {
    useEffect(() => {
      document.title = "CareerLens - Analisis Skill";
    });

  const [view, setView] = useState('selection');
  const [resultData, setResultData] = useState(null);
  
  // State untuk menyimpan skill yang diketik user
  const [inputtedSkills, setInputtedSkills] = useState([]);

  // Membuat atau mengambil ID 
  const getOrCreateUserId = () => {
    let userId = localStorage.getItem('careerlens_user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('careerlens_user_id', userId);
    }
    return userId;
  };

  const handleAnalyzeSkill = async (skillsArray) => {
    setInputtedSkills(skillsArray); 
    setView('result');

    try {
      const currentUserId = getOrCreateUserId();

      //url temp : http://localhost:5000/api/recommendations

      const response = await fetch(`${import.meta.env.VITE_API_URL}/recommendations`, {
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

  // Fungsi untuk menangani tombol kembali dan tes ulang
  const handleBackOrRetake = () => {
    setView('selection');
    setResultData(null); // Kosongkan data agar siap untuk tes baru
    setInputtedSkills([]); // Opsional: Kosongkan juga input skill jika ingin benar-benar reset
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] font-sans flex flex-col">
      {view === 'selection' ? (
        <SkillSelection onAnalyze={handleAnalyzeSkill} />
      ) : (
        <SkillResult 
          resultData={resultData}
          inputtedSkills={inputtedSkills}
          onBack={handleBackOrRetake} 
          onRetake={handleBackOrRetake} 
        />
      )}
    </div>
  );
};

export default AnalisisSkill;