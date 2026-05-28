import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import Particles from '../../components/Particles'; 
import userLogo from '../../../assets/careerLens_logo_1.png';

const fullText = "Temukan Lensa Karir Digitalmu";

// === PENGATURAN SPAWNER (TEKS MUNCUL OTOMATIS) ===
const config = {
  spawnInterval: 1000,   // Waktu (ms) setiap 1 teks baru muncul (1.2 detik)
  lifeTime: 3000,        // Waktu hidup teks di layar (8 detik) sebelum dihapus
  minDistance: 30,       // Jarak aman antar teks (25% layar) agar tidak numpuk
  baseOpacity: 0.08,     // Ketebalan teks
  startScale: 1.5,       // Ukuran awal
  endScale: 0.5,         // Ukuran akhir
};

const backgroundCareers = [
  "Software Engineer / Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App (Android/iOS) Developer",
  "DevOps Engineer",
  "QA / Software Tester",
  "System Analyst",
  "Game Developer",
  "Embedded Systems Engineer",
  "Cloud Engineer",
  "System Administrator",
  "Network Engineer",
  "Project Manager",
  "AR/VR Developer",
  "Blockchain Developer",
  "System Engineer",
  "Infrastructure Architect",
  "Virtualization Specialist",
  "Cyber Security Analyst/Architect",
  "Security Consultant",
  "Ethical Hacker",
  "SOC Analyst",
  "Information Security Specialist",
  "Cyber Defense",
  "Solution Architect",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Business Intelligence Analyst",
  "Data Engineer",
  "Product Analyst",
  "Big Data Engineer",
  "Analytics Engineer",
  "Deep Learning Engineer",
  "NLP Engineer (Natural Language Processing)",
  "Computer Vision Engineer",
  "AI Prompt Engineer",
  "Data Modeler",
  "Data Architect",
  "Database Developer",
  "Database Administrator (DBA)",
  "UI Designer",
  "UX Designer",
  "Product Designer",
  "Graphic Designer",
  "Motion Designer",
  "UX Researcher",
  "Illustrator",
  "3D Designer",
  "Game UI Designer",
  "Design System Designer",
  "AR/VR Developer (Unity)",
  "Digital Marketing Specialist",
  "SEO Specialist",
  "Content Strategist",
  "Performance Marketer (Ads)",
  "Marketing Analyst",
  "CRM Specialist",
  "Content Writer / Copywriter",
  "Social Media Manager",
  "Community Manager",
  "Virtual Assistant",
  "Marketing Associate",
  "E-commerce Manager",
  "Campaign Analyst",
  "Business Analyst (Marketing focus)"
];

const particleColorsList = ["#030B26", "#0277B6", "#94a3b8", "#cbd5e1"];

export default function Hero() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  // State untuk menyimpan daftar teks yang sedang "hidup" di layar
  const [activeTexts, setActiveTexts] = useState([]);
  const textIdCounter = useRef(0); // ID Unik untuk setiap teks baru

  useEffect(() => {
    const spawnerInterval = setInterval(() => {
      
      setActiveTexts((prevTexts) => {
        const now = Date.now();
        
        // 1. Hapus teks yang umurnya sudah melebihi 'lifeTime' (8 detik)
        const aliveTexts = prevTexts.filter(t => now - t.createdAt < config.lifeTime);

        // 2. Cari kordinat aman untuk teks baru
        let trialX = 50, trialY = 50;
        let isTooClose = true;
        let loopCounter = 0;

        while (isTooClose && loopCounter < 50) {
          trialX = Math.floor(Math.random() * 80 + 10);
          trialY = Math.floor(Math.random() * 80 + 10);
          
          // Cek jarak dengan teks yang masih hidup di layar
          isTooClose = aliveTexts.some(
            (t) => Math.abs(t.x - trialX) < config.minDistance && Math.abs(t.y - trialY) < config.minDistance
          );
          loopCounter++;
        }

        // 3. Pilih kata acak & ukuran acak
        const randomText = backgroundCareers[Math.floor(Math.random() * backgroundCareers.length)];
        const fontClasses = ["text-xl font-medium", "text-2xl font-semibold", "text-3xl font-medium"];
        const fontClass = fontClasses[Math.floor(Math.random() * fontClasses.length)];

        textIdCounter.current += 1;

        // 4. Masukkan teks baru ke dalam antrean layar
        return [
          ...aliveTexts,
          {
            id: textIdCounter.current,
            text: randomText,
            x: trialX,
            y: trialY,
            createdAt: now,
            fontClass
          }
        ];
      });

    }, config.spawnInterval);

    return () => clearInterval(spawnerInterval);
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setIsTypingComplete(true), 400);
      }
    }, 80);
    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section id="beranda" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden w-full text-slate-900 bg-linear-to-b from-white via-slate-50 to-blue-50/50">
      
      <style>{`
        @keyframes largeToSmallOnce {
          0% { 
            opacity: 0; 
            /* translateY dihapus, murni hanya scale/ukuran */
            transform: scale(${config.startScale}); 
          }
          15% { opacity: ${config.baseOpacity}; }
          50% { 
            opacity: ${config.baseOpacity}; 
            transform: scale(1); 
          }
          85% { opacity: ${config.baseOpacity}; }
          100% { 
            opacity: 0; 
            transform: scale(${config.endScale}); 
          }
        }
        .animate-ambient-text {
          animation: largeToSmallOnce ${config.lifeTime / 1000}s forwards linear;
        }
      `}</style>

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {activeTexts.map((item) => (
          <div
            key={item.id}
            className={`absolute text-[#030B26] whitespace-nowrap animate-ambient-text ${item.fontClass}`}
            style={{ 
              top: `${item.y}%`, 
              left: `${item.x}%`
            }}
          >
            {item.text}
          </div>
        ))}
      </div>

      <div 
        className={`absolute inset-0 z-0 transition-all duration-1000 ease-out transform pointer-events-none ${
          isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <Particles
          particleColors={particleColorsList}
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

      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center mt-24 md:mt-12 pointer-events-auto">
        
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
            <span 
              className={`inline-block w-1 h-[1em] bg-[#0277B6] ml-1 align-middle animate-pulse transition-opacity duration-500 ease-in-out ${
                isTypingComplete ? 'opacity-0' : 'opacity-100'
              }`}
            ></span>
          </span>
        </h1>
        <p 
          className={`text-slate-600 md:text-lg leading-relaxed max-w-2xl mb-10 transition-all duration-1000 delay-100 ease-out transform ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Platform analisis karier komprehensif yang memadukan asesmen minat, evaluasi keahlian, dan tes psikometrik terpandu untuk merekomendasikan peran teknologi yang paling sesuai dengan profil Anda.
        </p>

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