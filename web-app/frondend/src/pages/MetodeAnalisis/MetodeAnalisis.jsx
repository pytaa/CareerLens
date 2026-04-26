import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { FiArrowLeft } from 'react-icons/fi';
import { BiTargetLock, BiCodeAlt, BiBrain } from 'react-icons/bi';

const MetodeAnalisis = () => {
  const navigate = useNavigate();

  const methods = [
    {
      id: 'minat',
      title: 'Minat Karir',
      desc: 'Sudah tahu tujuan industri spesifik',
      icon: <BiTargetLock size={60} className="mb-5" />, 
      path: '/minat-karir'
    },
    {
      id: 'skill',
      title: 'Analisis Skill',
      desc: 'Input skill untuk menemukan industri yang cocok',
      icon: <BiCodeAlt size={60} className="mb-5" />,
      path: '/analisis-skill'
    },
    {
      id: 'bakat',
      title: 'Tes Bakat',
      desc: 'Belum yakin dengan skill yang dimiliki? Ayo ikut tes bakat',
      icon: <BiBrain size={60} className="mb-5" />,
      path: '/tes-bakat'
    }
  ];

  return (
    <div className="min-h-screen bg-[#030b26] font-sans flex flex-col">
      <Navbar />

      <main className="grow relative flex flex-col items-center justify-center p-6 mt-8">
        
        <div className="w-full max-w-5xl mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 bg-white text-slate-800 px-6 py-2 rounded-full font-medium shadow-md hover:bg-slate-100 transition-colors w-fit"
          >
            <FiArrowLeft size={20} /> Kembali
          </button>
        </div>


        <div className="bg-slate-50 w-full max-w-5xl rounded-4xl pt-8 pb-16 px-8 md:pt-12 md:pb-20 md:px-14 shadow-2xl flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-950 mb-12 md:mb-16 text-center">
            Metode Analisis
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-4xl">
            {methods.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="group flex flex-col items-center justify-center text-center bg-[#0277b6] hover:bg-[#026296] py-12 px-6 rounded-4xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full"
              >
                <div className="text-white opacity-100 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                
                <h2 className="text-2xl font-extrabold text-white mb-3">{item.title}</h2>
                
                <p className="text-white text-sm leading-relaxed px-2 font-medium">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default MetodeAnalisis;