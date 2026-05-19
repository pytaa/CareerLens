// src/pages/MinatKarir/MinatKarir.jsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../../components/Navbar';
import MinatSelection from './MinatSelection';
import MinatResult from './MinatResult';

const MinatKarir = () => {
  const [view, setView] = useState('selection'); 
  const [resultData, setResultData] = useState(null);

  //membuat atau mengambil ID Anonim dari peramban
  const getOrCreateUserId = () => {
    let userId = localStorage.getItem('careerlens_user_id');
    if (!userId) {
      userId = `user_${uuidv4()}`;
      localStorage.setItem('careerlens_user_id', userId);
    }
    return userId;
  };

  const handleSelectIndustry = async (industryId) => {
    setView('result');

    try {
      // Panggil fungsi UUID di sini
      const currentUserId = getOrCreateUserId(); 

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUserId, 
          method: "interest",
          payload: { interest_id: industryId }
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
        <MinatSelection onSelect={handleSelectIndustry} />
      ) : (
        <MinatResult data={resultData} />
      )}
    </div>
  );
};

export default MinatKarir;