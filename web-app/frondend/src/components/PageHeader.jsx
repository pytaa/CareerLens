// src/components/PageHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const PageHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full px-6 md:px-12 py-5 flex items-center relative shrink-0">
      
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors z-10"
      >
        <FiArrowLeft size={20} /> Kembali
      </button>

      {/* Logo CareerLens di Tengah (Disembunyikan di layar HP) */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 font-extrabold text-xl md:text-2xl text-blue-950 tracking-tight">
        CareerLens
      </div>
      
    </header>
  );
};

export default PageHeader;