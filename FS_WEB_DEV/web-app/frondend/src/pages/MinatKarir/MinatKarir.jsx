// src/pages/MinatKarir/MinatKarir.jsx
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MinatSelection from './MinatSelection';
import MinatResult from './MinatResult';

const MinatKarir = () => {
  const [view, setView] = useState('selection'); 
  const [resultData, setResultData] = useState(null);
  const [reqData, setReqData] = useState(null);

  useEffect(() => {
    document.title = "CareerLens - Minat karir";
  });

  // Membuat atau mengambil ID 
  const getOrCreateUserId = () => {
    let userId = localStorage.getItem('careerlens_user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('careerlens_user_id', userId);
    }
    return userId;
  };

  const handleSelectIndustry = async (industryId) => {
    setView('result');

    try {
      const currentUserId = getOrCreateUserId(); 
      const reqPayload = {
        user_id: currentUserId, 
        method: "interest",
        payload: { interest_id: industryId }
      };
      setReqData(reqPayload);

      //url temp : http://localhost:5000/api/recommendations
      

      const response = await fetch(`${import.meta.env.VITE_API_URL}/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqPayload)
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

  // Fungsi untuk tombol kembali & tes ulang
  const handleBackOrRetake = () => {
    setView('selection');
    setResultData(null); // Kosongkan data agar siap untuk tes baru
    setReqData(null);
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] font-sans flex flex-col">
      {view === 'selection' ? (
        <MinatSelection onSelect={handleSelectIndustry} />
      ) : (
        <MinatResult 
          resultData={resultData}
          reqData={reqData}
          onBack={handleBackOrRetake} 
          onRetake={handleBackOrRetake} 
        />
      )}
    </div>
  );
};

export default MinatKarir;