import React, { useEffect, useRef, useState } from 'react';
import { BiCodeAlt, BiData, BiPalette, BiTrendingUp } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';

import gambarIT from "../../../assets/TI_dan_software.png"
import gambarData from "../../../assets/dataScience_dan_AI.png"
import desainKreatif from "../../../assets/desainKreatif_dan_UIUX.png"
import digitalMarketing from "../../../assets/digitalMarketing_dan_analis.png"

// Komponen Pembungkus untuk Efek Animasi Muncul Saat Di-Scroll
const ScrollFadeIn = ({ children, delay = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Jika elemen masuk ke dalam layar (viewport)
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Hentikan observasi setelah animasi berjalan 1x
        }
      },
      { threshold: 0.2 } // Animasi terpicu saat 20% elemen sudah terlihat
    );

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  // Menentukan arah datangnya animasi
  let translateClass = 'translate-y-16'; // default 'up'
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

export default function Industri() {
  const industries = [
    { 
      id: 'it_software', 
      title: 'Teknologi Informasi & Software Development', 
      desc: 'Membangun solusi perangkat lunak yang skalabel, arsitektur sistem cloud, dan aplikasi mobile masa depan. Peran ideal bagi Anda yang menyukai logika komputasi.', 
      icon: <BiCodeAlt size={32} />,
      color: 'bg-blue-100 text-blue-600',
      image: gambarIT,
      link: 'https://docif.telkomuniversity.ac.id/apa-itu-software-developer-pengertian-tugas-dan-skillnya/'
    },
    { 
      id: 'data_science', 
      title: 'Data Science & Artificial Intelligence', 
      desc: 'Mengolah big data menjadi wawasan strategis dan mengembangkan model machine learning cerdas. Cocok untuk pemikir analitis dan pemecah masalah.', 
      icon: <BiData size={32} />,
      color: 'bg-indigo-100 text-indigo-600',
      image: gambarData,
      link: 'https://id.jobstreet.com/id/career-advice/article/apa-itu-data-science-tugas-gaji'
    },
    { 
      id: 'design_uiux', 
      title: 'Desain Kreatif & UI/UX Design', 
      desc: 'Menciptakan pengalaman interaksi digital yang intuitif dan visual estetis. Karier yang memadukan empati pengguna dengan kreativitas tanpa batas.', 
      icon: <BiPalette size={32} />,
      color: 'bg-purple-100 text-purple-600',
      image: desainKreatif,
      link: 'https://jakarta.telkomuniversity.ac.id/mengenal-ui-ux-designer-profesi-yang-diminati-di-era-digital/'
    },
    { 
      id: 'digital_marketing', 
      title: 'Digital Marketing & Analytics', 
      desc: 'Memanfaatkan kanal digital dan metrik data untuk mengoptimalkan pertumbuhan bisnis. Jalur tepat bagi yang berminat pada strategi dan perilaku konsumen.', 
      icon: <BiTrendingUp size={32} />,
      color: 'bg-emerald-100 text-emerald-600',
      image: digitalMarketing,
      link: 'https://www.lspr.ac.id/apa-itu-digital-marketing/'
    }
  ];

  return (
    // Background sedikit abu-abu untuk membedakan dengan Hero section yang putih/gradasi
    <section id="industri" className="py-24 md:py-32 bg-slate-50 overflow-hidden w-full">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <ScrollFadeIn direction="up">
            <span className="text-[#0277B6] font-bold tracking-wider uppercase text-sm mb-4 block">Peluang Karir</span>
          </ScrollFadeIn>
          <ScrollFadeIn direction="up" delay={150}>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#030B26] mb-6">
              Jelajahi Sektor Industri Digital
            </h2>
          </ScrollFadeIn>
          <ScrollFadeIn direction="up" delay={300}>
            <p className="text-slate-500 md:text-lg max-w-2xl mx-auto leading-relaxed">
              Pelajari berbagai bidang industri teknologi terkini dan temukan jalur spesialisasi yang paling sejalan dengan ambisi masa depan Anda.
            </p>
          </ScrollFadeIn>
        </div>

        {/* List Industri (Zig-Zag Layout) */}
        <div className="space-y-24 md:space-y-32">
          {industries.map((item, index) => {
            // Logika Zig-Zag: Genap di kiri, Ganjil di kanan
            const isEven = index % 2 === 0;

            return (
              <div key={item.id} className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                
                {/* Bagian Gambar */}
                <div className="w-full md:w-1/2">
                  <ScrollFadeIn direction={isEven ? 'left' : 'right'}>
                    <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(3,11,38,0.08)] group">
                      <div className="absolute inset-0 bg-[#030B26]/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-auto aspect-video md:aspect-4/3 object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                    </div>
                  </ScrollFadeIn>
                </div>

                {/* Bagian Teks */}
                <div className="w-full md:w-1/2 flex flex-col items-start text-left">
                  <ScrollFadeIn direction="up" delay={200}>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${item.color}`}>
                      {item.icon}
                    </div>
                  </ScrollFadeIn>
                  
                  <ScrollFadeIn direction="up" delay={350}>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#030B26] mb-4 leading-tight">
                      {item.title}
                    </h3>
                  </ScrollFadeIn>
                  
                  <ScrollFadeIn direction="up" delay={500}>
                    <p className="text-slate-500 leading-relaxed mb-8">
                      {item.desc}
                    </p>
                  </ScrollFadeIn>
                  
                  <ScrollFadeIn direction="up" delay={650}>
                    {/* Mengubah <button> menjadi <a> */}
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#0277B6] font-bold group hover:text-[#030B26] transition-colors"
                    >
                      Pelajari Lebih Lanjut
                      <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </ScrollFadeIn>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}