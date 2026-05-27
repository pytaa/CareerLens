// src/components/ResultHeader.jsx
import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; 
import LogoCareerLens from '../../assets/careerLens_logo_2.png';

const ResultHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between border-b border-slate-100 shrink-0 sticky top-0 bg-white/80 backdrop-blur-md z-20">
      
      {/* TOMBOL KEMBALI */}
      <button 
        onClick={() => navigate('/')} // Langsung arahkan ke root/homepage
        className="flex items-center gap-2 text-slate-500 hover:text-[#000066] font-medium transition-colors"
      >
        <FiArrowLeft size={20} /> 
        {/* Class "hidden md:inline" akan menyembunyikan teks di mobile dan memunculkannya di layar yang lebih besar */}
        <span className="hidden md:inline">Kembali ke Beranda</span>
      </button>
      
      {/* LOGO */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <img 
          src={LogoCareerLens} 
          alt="CareerLens Logo" 
          className="h-6 md:h-8 object-contain" // Ketinggian gambar disesuaikan responsif
        />
      </div>
      
      {/* Spacer Penyeimbang agar logo tetap persis di tengah */}
      <div className="w-5 md:w-37.5"></div> 
    </header>
  );
};

export default ResultHeader;