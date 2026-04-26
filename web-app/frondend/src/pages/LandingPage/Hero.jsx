import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { BiTargetLock } from 'react-icons/bi';
import bannerImage from '../../../../assets/dashboard_banner.png';


export default function Hero(){
   const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Left Content */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-full text-sm font-medium">
          <BiTargetLock size={18} />
          <span>Navigasi Karir Masa Depan</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
          Temukan <span className="italic text-blue-700">Lensa<br/>Karir</span> Digitalmu.
        </h1>
        
        <p className="text-lg text-blue-800/80 max-w-md">
          Platform rekomendasi karir untuk 4 sektor industri digital utama: IT, Data Science, Desain, dan Digital Marketing
        </p>

        <button 
          onClick={() => navigate('/metode')}
          className="mt-8 flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-white px-8 py-4 rounded-full text-lg font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Mulai Analisis Karir <FiArrowRight size={24} />
        </button>
      </div>

      {/* Right Content (Image) */}
      <div className="relative h-400px md:h-500px w-full rounded-4xl overflow-hidden shadow-2xl">
        {/* Ganti src dengan path gambar aslimu */}
        <img 
          src={bannerImage}
          alt="Tim sedang berdiskusi" 
          className="w-full h-full object-cover"
        />
        <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-cyan-100 rounded-[3rem] -z-10"></div>
      </div>
    </section>
  );
}