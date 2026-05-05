import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiX, FiChevronDown } from 'react-icons/fi';
import { BiBrain, BiBarChartAlt2 } from 'react-icons/bi';

const SkillSelection = ({ onAnalyze }) => {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Daftar skill
  const availableSkills = [
    "Design", "Machine Learning", "Automation", "Database Administrator", 
    "Visualization", "JavaScript", "Python", "Networking"
  ];

  // Menyaring daftar skill yang ditampilkan di dropdown (mencari yang cocok dengan input dan belum dipilih)
  const filteredSkills = availableSkills.filter(skill => 
    skill.toLowerCase().includes(inputValue.toLowerCase()) && 
    !selectedSkills.includes(skill)
  );

  // Fungsi menambah skill dari ketikan manual
  const handleAddSkill = () => {
    const trimmedSkill = inputValue.trim();
    if (trimmedSkill && !selectedSkills.includes(trimmedSkill)) {
      setSelectedSkills([...selectedSkills, trimmedSkill]);
    }
    setInputValue('');
    setIsDropdownOpen(false);
  };

  // Fungsi menambah skill dari klik list dropdown
  const handleAddSkillFromList = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setInputValue('');
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
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
    <div className="min-h-screen bg-slate-50/50 font-sans flex flex-col">
      
      {/* Header Minimalis */}
      <header className="w-full px-6 md:px-10 py-5 flex items-center relative bg-white/50 border-b border-slate-200/60 z-10 backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          <FiArrowLeft size={20} /> Kembali
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 font-extrabold text-xl text-blue-950 tracking-tight">
          CareerLens
        </div>
      </header>

      {/* Main Container */}
      <main className="grow flex flex-col items-center pt-12 md:pt-16 px-6 pb-20 w-full">
        
        <div className="text-center max-w-2xl mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#030b26] mb-4">
            Analisis Skill
          </h1>
          <p className="text-slate-500 md:text-lg leading-relaxed">
            Masukkan keahlian Anda untuk mendapatkan rekomendasi sektor yang paling sesuai.
          </p>
        </div>

        {/* Card Form Input */}
        <div className="bg-white w-full max-w-3xl rounded-4xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          
          <div className="mb-8 relative">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                Keahlian Utama
              </label>
              <span className={`text-xs font-bold ${selectedSkills.length < 2 ? 'text-red-500' : 'text-green-600'}`}>
                Min. 2 Keahlian
              </span>
            </div>

            {/* Input Group */}
            <div className="relative flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
              <div className="pl-5 pr-2 text-slate-400">
                 <BiBrain size={22} />
              </div>
              <input 
                type="text" 
                placeholder="Ketik keahlian Anda (misal: Python, Project Management...)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Delay agar onClick di list sempat tereksekusi
                className="grow py-4 px-2 outline-none text-slate-700 bg-transparent placeholder:text-slate-400"
              />
              
              {/* Icon panah penanda ada dropdown */}
              <div className="px-2 text-slate-400 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                 <FiChevronDown size={20} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              <button 
                onClick={handleAddSkill}
                disabled={!inputValue.trim()}
                className="bg-slate-50 hover:bg-slate-100 text-[#030b26] disabled:text-slate-400 font-bold px-8 py-4 border-l border-slate-200 transition-colors h-full"
              >
                Tambah
              </button>
            </div>

            {/* Dropdown Menu (Muncul di bawah input saat difokuskan) */}
            {isDropdownOpen && filteredSkills.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#030b26] border border-blue-900 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                {filteredSkills.map((skill) => (
                  <div
                    key={skill}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Mencegah input kehilangan fokus terlalu cepat
                      handleAddSkillFromList(skill);
                    }}
                    className="w-full text-left px-5 py-3.5 text-white hover:bg-[#0277b6] cursor-pointer border-b border-slate-700/50 last:border-0 transition-colors text-sm font-medium"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Area Tags Keahlian */}
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-10">
              {selectedSkills.map((skill) => (
                <span 
                  key={skill} 
                  className="flex items-center gap-2 bg-slate-100 text-[#030b26] px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-slate-200"
                >
                  {skill}
                  <button 
                    onClick={() => handleRemoveSkill(skill)} 
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <FiX size={16} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tombol Submit */}
          <div className={`flex justify-center ${selectedSkills.length === 0 ? 'mt-10' : 'mt-6'}`}>
            <button 
              onClick={handleSubmit}
              disabled={selectedSkills.length < 2}
              className="flex items-center gap-3 bg-[#030b26] hover:bg-[#0a194f] disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
            >
              <BiBarChartAlt2 size={24} />
              Temukan Sektor dan Analisis
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SkillSelection;