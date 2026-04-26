// src/pages/AnalisisSkill/SkillSelection.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiX, FiChevronDown } from 'react-icons/fi';

const SkillSelection = ({ onAnalyze }) => {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Daftar skill statis berdasarkan desain UI
  const availableSkills = [
    "Design", "Machine Learning", "Automation", "Database Administrator", 
    "Visualization", "JavaScript", "Python", "Networking"
  ];

  const handleAddSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setIsDropdownOpen(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = () => {
    if (selectedSkills.length >= 2) {
      onAnalyze(selectedSkills);
    }
  };

  return (
    <div className="grow flex flex-col items-center justify-center p-6 w-full max-w-5xl mx-auto">
      
      {/* Tombol Kembali */}
      <div className="w-full mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 bg-white text-slate-800 px-6 py-2 rounded-full font-medium shadow-md hover:bg-slate-100 transition-colors w-max"
        >
          <FiArrowLeft size={20} /> Kembali
        </button>
      </div>

      {/* Box Utama */}
      <div className="bg-[#030b26] w-full rounded-4xl p-10 shadow-2xl relative">
        <div className="bg-cyan-100 rounded-3xl p-8 md:p-12 w-full max-w-3xl mx-auto flex flex-col items-center">
          
          <h1 className="text-3xl md:text-4xl font-bold text-[#030b26] mb-8 text-center">Analisis Skill</h1>
          
          <div className="w-full relative mb-8">
            <div className="flex justify-between items-end mb-2">
              <label className="font-medium text-slate-700">Daftar Skill</label>
              <span className={`text-sm font-bold ${selectedSkills.length < 2 ? 'text-red-500' : 'text-green-600'}`}>
                Min. 2 Skill
              </span>
            </div>

            {/* Area Input (Tag Container) */}
            <div className="w-full min-h-15 bg-[#0277b6] rounded-xl p-3 flex flex-wrap items-center gap-2">
              {selectedSkills.length === 0 && (
                <span className="text-blue-200/70 ml-2">Pilih Keahlian (misal python, javascript, etc.)</span>
              )}
              
              {selectedSkills.map((skill) => (
                <div key={skill} className="bg-slate-200 text-slate-800 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium shadow-sm">
                  <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500 p-0.5 border border-slate-400 rounded-full">
                    <FiX size={12} />
                  </button>
                  {skill}
                </div>
              ))}

              {/* Tombol Dropdown Tambah */}
              <div className="relative ml-auto">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="bg-white text-slate-800 px-4 py-1.5 rounded-lg flex items-center gap-2 font-medium hover:bg-slate-100 text-sm"
                >
                  Tambah <FiChevronDown />
                </button>

                {/* Menu Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#030b26] border border-blue-900 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {availableSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => handleAddSkill(skill)}
                        disabled={selectedSkills.includes(skill)}
                        className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#0277b6] disabled:opacity-50 disabled:cursor-not-allowed border-b border-blue-900/50 last:border-0"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={selectedSkills.length < 2}
            className="bg-[#1e2756] hover:bg-[#030b26] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all"
          >
            Temukan Sektor dan Analisis
          </button>

        </div>
      </div>

    </div>
  );
};

export default SkillSelection;