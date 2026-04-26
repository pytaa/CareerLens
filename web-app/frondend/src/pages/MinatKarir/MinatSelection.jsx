// src/pages/MinatKarir/MinatSelection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { FaCode, FaDatabase, FaPalette, FaChartLine } from 'react-icons/fa';

const MinatSelection = ({ onSelect }) => {
  const navigate = useNavigate();

  const industries = [
    { id: 'it_software', title: 'Teknologi Informasi & Software Development', desc: 'DevOps, Cyber, etc.', icon: <FaCode size={32} /> },
    { id: 'data_science', title: 'Data Science & Artificial Intelligence', desc: 'Data Analyst, Machine Learning, etc.', icon: <FaDatabase size={32} /> },
    { id: 'design_uiux', title: 'Desain Kreatif & UI/UX', desc: 'Design product, visual, etc.', icon: <FaPalette size={32} /> },
    { id: 'digital_marketing', title: 'Digital Marketing & Analytics', desc: 'Copy writing, VA, etc.', icon: <FaChartLine size={32} /> }
  ];

  return (
    <div className="grow flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto">
      
      {/* Tombol Kembali */}
      <div className="w-full mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 bg-blue-950 text-white px-6 py-2 rounded-full font-medium shadow-md hover:bg-blue-900 transition-colors w-max"
        >
          <FiArrowLeft size={20} /> Kembali
        </button>
      </div>

      {/* Box Utama */}
      <div className="bg-blue-950 w-full rounded-4xl p-10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-10 text-center">Minat Karir</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {industries.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="flex items-center gap-4 bg-[#0277b6] hover:bg-[#026296] text-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-left"
            >
              <div className="shrink-0">{item.icon}</div>
              <div>
                <h2 className="font-bold text-lg leading-tight">{item.title}</h2>
                <p className="text-sm text-blue-200 mt-1">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default MinatSelection;