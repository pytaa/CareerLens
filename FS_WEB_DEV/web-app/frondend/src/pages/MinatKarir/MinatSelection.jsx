import React from 'react';
import { FiArrowLeft, FiChevronRight } from 'react-icons/fi';
import { BiCodeAlt, BiData, BiPalette, BiTrendingUp } from 'react-icons/bi';
import PageHeader from "../../components/PageHeader.jsx"

const MinatSelection = ({ onSelect }) => {

  const industries = [
    { 
      id: "F01", 
      title: 'Teknologi Informasi & Software Development', 
      desc: 'Membangun solusi perangkat lunak yang skalabel, arsitektur sistem cloud, dan aplikasi mobile masa depan.', 
      icon: <BiCodeAlt size={24} className="text-[#0277b6]" /> 
    },
    { 
      id: "F02", 
      title: 'Data Science & Artificial Intelligence', 
      desc: 'Mengolah data besar menjadi wawasan strategis dan mengembangkan algoritma cerdas berbasis AI.', 
      icon: <BiData size={24} className="text-[#0277b6]" /> 
    },
    { 
      id: "F03", 
      title: 'Desain Kreatif & UI/UX Design', 
      desc: 'Menciptakan pengalaman pengguna yang intuitif dan visual yang estetik untuk produk digital modern.', 
      icon: <BiPalette size={24} className="text-[#0277b6]" /> 
    },
    { 
      id: "F04", 
      title: 'Digital Marketing & Analytics', 
      desc: 'Mengoptimalkan pertumbuhan bisnis melalui strategi pemasaran digital berbasis performa dan data.', 
      icon: <BiTrendingUp size={24} className="text-[#0277b6]" /> 
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* Header Minimalis */}
      <PageHeader />


      {/* Main Container: py-10 memberikan ruang napas di atas dan bawah saat di-scroll */}
      <main className="grow flex flex-col items-center justify-center px-6 py-10 md:py-12 w-full">
        
        {/* Kontainer dibatasi max-w-7xl agar mengisi ruang kosong tapi tidak terlalu melar */}
        <div className="w-full max-w-7xl">
          
          {/* Title & Subtitle */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              Pilih Minat Karir
            </h1>
            <p className="text-slate-500 md:text-lg leading-relaxed max-w-2xl mx-auto">
              Temukan jalur profesional yang sesuai dengan keahlian dan aspirasi Anda untuk masa depan yang lebih cerah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
            {industries.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className="group flex flex-col items-start text-left bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 border border-slate-100"
              >
                {/* Kotak Ikon */}
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                  {item.icon}
                </div>

                <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
                  {item.title}
                </h2>

                <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6 grow">
                  {item.desc}
                </p>

                {/* Action Link */}
                <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm mt-auto group-hover:text-indigo-700 transition-colors">
                  Lihat Peluang 
                  <FiChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default MinatSelection;