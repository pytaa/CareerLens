import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
// Import icon/logo dari folder assets
import CareerLensIcon from '../../assets/careerLens_logo_2.png';

const PageHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full px-6 md:px-12 py-5 flex items-center relative shrink-0">
      
      {/* Tombol Kembali */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors z-10"
      >
        {/* Ikon panah tetap ada di semua layar */}
        <FiArrowLeft size={20} /> 
        {/* Tulisan 'Kembali' disembunyikan di HP (hidden), dan muncul di ukuran medium ke atas (md:inline) */}
        <span className="hidden md:inline">Kembali</span>
      </button>

      {/* Logo CareerLens di Tengah */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        <img 
          src={CareerLensIcon} 
          alt="CareerLens Icon" 
          className="h-8 md:h-10 object-contain" 
        />
        {/* Opsional: Jika gambar iconmu tidak ada teks "CareerLens"-nya dan kamu masih ingin memunculkan teksnya di layar besar, aktifkan kode di bawah ini: */}
        {/* <span className="hidden md:block font-extrabold text-xl md:text-2xl text-blue-950 tracking-tight ml-2">CareerLens</span> */}
      </div>
      
    </header>
  );
};

export default PageHeader;