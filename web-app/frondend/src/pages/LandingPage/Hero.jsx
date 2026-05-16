import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import Particles from '../../components/Particles'; 
import userLogo from '../../../../assets/careerLens_logo_1.png';

export default function Hero() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  const fullText = "Temukan Lensa Karir Digitalmu";

  useEffect(() => {
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setIsTypingComplete(true);
        }, 400);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    // PERBAIKAN LATAR: Menggunakan gradasi linear vertikal yang sangat halus (putih ke abu-abu muda ke biru pucat)
    <section id="beranda" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden w-full text-slate-900 bg-linear-to-b from-white via-slate-50 to-blue-50/50">
      
      {/* Particles Background */}
      <div 
        className={`absolute inset-0 z-0 transition-all duration-1000 ease-out transform ${
          isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <Particles
          particleColors={["#030B26", "#0277B6", "#94a3b8", "#cbd5e1"]}
          particleCount={250}
          particleSpread={12}
          speed={0.15}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          particleHoverFactor={1.5}
          alphaParticles={true}
          disableRotation={false}
          pixelRatio={window.devicePixelRatio || 1} 
        />
      </div>

      {/* Konten Utama Hero */}
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center mt-24 md:mt-12">
        
        <div 
          className={`relative mb-4 transition-all duration-1000 ease-out transform ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
           <img 
             src={userLogo} 
             alt="CareerLens Custom Logo" 
             className="h-24 w-24 md:h-28 md:w-28 object-contain" 
           />
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-[#030B26] leading-tight mb-6 min-h-20 md:min-h-30 flex items-center justify-center">
          <span>
            {typedText}
            <span className={`inline-block w-1 h-[1em] bg-[#0277B6] ml-1 align-middle animate-pulse ${isTypingComplete ? 'hidden' : ''}`}></span>
          </span>
        </h1>

        <p 
          className={`text-slate-600 md:text-lg leading-relaxed max-w-2xl mb-10 transition-all duration-1000 delay-100 ease-out transform ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Platform analisis karier komprehensif yang memadukan asesmen minat, evaluasi keahlian, dan tes psikometrik terpandu untuk merekomendasikan peran teknologi yang paling sesuai dengan profil Anda.
        </p>

        {/* PERBAIKAN TOMBOL: Dibuat warna solid #0277B6 yang sederhana, elegan, dan profesional */}
        <div 
          className={`transition-all duration-1000 delay-200 ease-out transform ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <button 
            onClick={() => navigate('/metode')}
            className="group flex items-center gap-3 bg-[#0277B6] hover:bg-[#025c8d] text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/10 transition-all hover:-translate-y-0.5"
          >
            Mulai Analisis
            <BsArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}