import React, { useEffect, useRef, useState } from 'react';
import { BiData } from 'react-icons/bi';
import { BsCheckCircleFill } from 'react-icons/bs';
import { TbBrain } from 'react-icons/tb';

const ScrollFadeIn = ({ children, delay = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  let translateClass = 'translate-y-16';
  if (direction === 'left') translateClass = '-translate-x-16';
  if (direction === 'right') translateClass = 'translate-x-16';

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${translateClass}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function About() {
  const matchCards = [
    { id: 1, title: "Cloud Architect", pos: "-top-10 -left-4 md:-left-12" },
    { id: 2, title: "Frontend Developer", pos: "top-10 left-10 md:left-20" },
    { id: 3, title: "Digital Marketer", pos: "top-32 -left-2 md:-left-8" },
    { id: 4, title: "Cybersecurity Analyst", pos: "bottom-0 right-0 md:-right-4" },
    { id: 5, title: "Data Scientist", pos: "-top-4 right-4 md:right-12" },
    { id: 6, title: "Senior Product Designer", pos: "top-20 -right-8 md:-right-16" },
    { id: 7, title: "AI Engineer", pos: "bottom-16 left-6 md:left-14" },
    { id: 8, title: "Product Manager", pos: "bottom-8 -left-6 md:-left-12" },
  ];

  return (
    <section id="tentang" className="py-24 md:py-32 bg-slate-50 overflow-hidden w-full relative">
      
      {/* PERBAIKAN ANIMASI: Dipercepat menjadi 8 detik dan timing-nya disesuaikan */}
      <style>{`
        @keyframes continuousPop {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          10% { opacity: 1; transform: translateY(0) scale(1); }
          35% { opacity: 1; transform: translateY(0) scale(1); }
          45% { opacity: 0; transform: translateY(-20px) scale(0.95); }
          100% { opacity: 0; transform: translateY(-20px) scale(0.95); }
        }
        .animate-card-loop {
          animation: continuousPop 8s infinite ease-in-out;
          opacity: 0; 
        }
      `}</style>

      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
          
          {/* Bagian Kiri: Konten Teks */}
          <div className="w-full md:w-1/2 flex flex-col items-start text-left z-20">
            <ScrollFadeIn direction="right">
              <span className="text-[#0277B6] font-bold tracking-widest uppercase text-xs mb-4 block">
                Intelligence
              </span>
            </ScrollFadeIn>
            
            <ScrollFadeIn direction="right" delay={150}>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#030B26] mb-6 leading-tight">
                Kejelasan di Tengah Kompleksitas
              </h2>
            </ScrollFadeIn>

            <ScrollFadeIn direction="right" delay={300}>
              <p className="text-slate-500 md:text-lg leading-relaxed mb-10">
                Kami menggunakan model AI yang dilatih pada ribuan profil karir sukses untuk memetakan DNA profesional Anda ke dalam peluang masa depan.
              </p>
            </ScrollFadeIn>

            <div className="space-y-8 w-full">
              <ScrollFadeIn direction="up" delay={450}>
                <div className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-[#030B26] shadow-sm bg-white">
                    <BiData size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#030B26] mb-2">Data-Driven Methodology</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                      Algoritma kami menganalisis tren pasar global secara real-time untuk memberikan saran yang relevan.
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>

              <ScrollFadeIn direction="up" delay={600}>
                <div className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-[#030B26] shadow-sm bg-white">
                    <TbBrain size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#030B26] mb-2">AI Analysis</h4>
                    <p className="text-slate-500 leading-relaxed text-sm">
                      Analisis kognitif dan teknis yang mendalam untuk memprediksi kecocokan peran dengan akurasi tinggi.
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>
          </div>

          {/* Bagian Kanan: Visual & Animasi Tumpukan Kartu Lurus Loop */}
          {/* PERBAIKAN MARGIN: md:pl-16 ditambahkan agar sedikit menjauh dari teks */}
          <div className="w-full md:w-1/2 relative mt-20 md:mt-0 flex justify-center z-10 md:pl-16">
            <ScrollFadeIn direction="left" delay={300}>
              
              {/* PERBAIKAN KOTAK: Background kotak dihapus, hanya menyisakan area transparan sebagai ruang animasi */}
              <div className="relative w-full max-w-100 h-100 flex items-center justify-center">

                {/* Looping CSS untuk Kartu */}
                {matchCards.map((item, index) => {
                  // PERBAIKAN DELAY: Dipercepat menjadi selisih 1 detik antar kartu
                  const delay = index * 1.0; 
                  
                  return (
                    <div 
                      key={item.id}
                      className={`absolute ${item.pos} bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_15px_40px_rgba(3,11,38,0.06)] flex items-center gap-4 border border-slate-100 w-60 md:w-65 animate-card-loop z-${index * 10}`}
                      style={{ animationDelay: `${delay}s` }}
                    >
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                        <BsCheckCircleFill size={18} />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mb-1">
                          Career Match Found
                        </span>
                        <h3 className="text-sm font-extrabold text-[#030B26] leading-tight">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  );
                })}

              </div>

            </ScrollFadeIn>
          </div>

        </div>

      </div>
    </section>
  );
}