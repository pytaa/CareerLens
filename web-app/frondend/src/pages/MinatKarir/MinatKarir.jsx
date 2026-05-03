// src/pages/MinatKarir/MinatKarir.jsx
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import MinatSelection from './MinatSelection';
import MinatResult from './MinatResult';

const MinatKarir = () => {
  // State untuk melacak apakah user sedang memilih atau sedang melihat hasil
  const [view, setView] = useState('selection'); // 'selection' | 'result'
  // State untuk menyimpan data JSON dari backend
  const [resultData, setResultData] = useState(null);

  // Fungsi yang dipanggil saat salah satu kotak industri diklik
  const handleSelectIndustry = async (industryId) => {
    // 1. Pindah tampilan ke halaman hasil (akan menampilkan tulisan loading)
    setView('result');

    try {
      // 2. Fetch ke Backend Dummy kita (sesuai API Contract)
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: "user_anonim_123", // UUID dummy
          method: "interest",
          payload: { interest_id: industryId }
        })
      });

      const jsonResponse = await response.json();

      // 3. Simpan data hasil ke state
      if (jsonResponse.status === 'success') {
        setResultData(jsonResponse.data);
      } else {
        alert("Gagal menganalisis: " + jsonResponse.message);
        setView('selection'); // Kembali jika gagal
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Terjadi kesalahan koneksi ke server.");
      setView('selection');
    }
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] font-sans flex flex-col">
      
      {/* Mengatur komponen mana yang dirender berdasarkan state view */}
      {view === 'selection' ? (
        <MinatSelection onSelect={handleSelectIndustry} />
      ) : (
        <MinatResult data={resultData} />
      )}
      
    </div>
  );
};

export default MinatKarir;