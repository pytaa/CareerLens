// src/components/ResultHeader.jsx
import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';

const ResultHeader = ({ onBack }) => {
  return (
    <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between border-b border-slate-100 shrink-0 sticky top-0 bg-white/80 backdrop-blur-md z-20">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
      >
        <FiArrowLeft size={20} /> Kembali ke Beranda
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 font-extrabold text-xl text-[#030B26] tracking-tight">
        CareerLens
      </div>
      <div className="hidden md:block w-30"></div> {/* Spacer penyeimbang */}
    </header>
  );
};

export default ResultHeader;