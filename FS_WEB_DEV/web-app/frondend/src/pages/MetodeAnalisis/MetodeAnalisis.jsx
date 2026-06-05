import React from 'react';
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiChevronRight } from 'react-icons/fi';
import { BiTargetLock, BiCodeAlt, BiBrain } from 'react-icons/bi';
import PageHeader from "../../components/PageHeader.jsx"

const MetodeAnalisis = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "CareerLens - Metode Analisis";
  });

  const methods = [
    {
      id: 'minat',
      title: 'Minat Karir',
      desc: 'Analisis minat mendalam untuk menemukan bidang pekerjaan yang paling sesuai dengan passion dan aspirasi pribadi Anda.',
      icon: <BiTargetLock size={28} className="text-blue-700" />,
      path: '/minat-karir'
    },
    {
      id: 'skill',
      title: 'Analisis Skill',
      desc: 'Evaluasi kompetensi teknis dan soft skills yang Anda miliki saat ini untuk dipetakan ke kebutuhan standar industri terkini.',
      icon: <BiCodeAlt size={28} className="text-blue-700" />,
      path: '/analisis-skill'
    },
    {
      id: 'bakat',
      title: 'Tes Bakat',
      desc: 'Uji kecerdasan kognitif dan potensi alami Anda melalui serangkaian asesmen psikometrik yang telah tervalidasi secara saintifik.',
      icon: <BiBrain size={28} className="text-blue-700" />,
      path: '/tes-bakat'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* Header Minimalis */}
      <PageHeader />


      {/* Main Container dipusatkan (justify-center) untuk menghindari scroll */}
      <main className="grow flex flex-col items-center justify-center px-6 pb-8">
        
        {/* Title & Subtitle */}
        <div className="text-center max-w-2xl mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-950 mb-4">
            Metode Analisis
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed">
            Pilih salah satu metode di bawah ini untuk memulai pemetaan jalur karir profesional Anda secara akurat.
          </p>
        </div>

        {/* Grid Kartu Pilihan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl">
          {methods.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="group flex flex-col items-start text-left bg-white p-6 lg:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 border border-slate-100/80"
            >
              {/* Kotak Ikon */}
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-blue-100/60 rounded-2xl flex items-center justify-center mb-6">
                {item.icon}
              </div>

              {/* Judul Kartu */}
              <h2 className="text-xl lg:text-2xl font-bold text-blue-950 mb-3">{item.title}</h2>

              {/* Deskripsi */}
              <p className="text-slate-500 text-sm lg:text-base leading-relaxed mb-8 grow">
                {item.desc}
              </p>

              {/* Action Link */}
              <div className="flex items-center gap-2 text-blue-600 text-sm font-bold tracking-wider uppercase mt-auto">
                MULAI ANALISIS 
                <FiChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MetodeAnalisis;