import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGlobe, FiMoon } from 'react-icons/fi';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    // PERBAIKAN: py-6 diubah menjadi py-4 agar tinggi navbar lebih ramping
    <nav className="w-full px-6 md:px-16 py-4 flex items-center justify-between bg-white/90 backdrop-blur-sm fixed top-0 z-50 border-b border-slate-100">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 bg-[#0277B6] rounded-full flex items-center justify-center text-white font-bold">
          C
        </div>
        <span className="font-extrabold text-xl text-[#030B26] tracking-tight">CareerLens</span>
      </div>

      {/* Menu Tengah */}
      <div className="hidden md:flex items-center gap-10">
        <a href="#beranda" className="text-[#030B26] font-bold border-b-2 border-[#0277B6] pb-1">Beranda</a>
        <a href="#industri" className="text-slate-600 hover:text-[#030B26] font-medium transition-colors">Industri</a>
        <a href="#tentang" className="text-slate-600 hover:text-[#030B26] font-medium transition-colors">Tentang</a>
      </div>

      {/* Ikon Kanan */}
      <div className="flex items-center gap-4 text-slate-500">
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <FiGlobe size={20} />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <FiMoon size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;