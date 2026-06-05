import React from 'react';
import { FiGithub } from 'react-icons/fi';
import CareerLensLogo from '../../assets/careerLens_logo_1.png';

const ResultFooter = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-100 py-10 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Credits */}
        <div>
          <h4 className="font-bold text-[#030B26] mb-4 text-sm tracking-wider uppercase">Credits</h4>
          <p className="text-slate-500 text-sm leading-relaxed pr-4">
            Aplikasi ini dikembangkan oleh Tim CareerLens sebagai proyek akhir (Capstone Project). Kami berdedikasi untuk membantu generasi muda menemukan jalur karir dan peta jalan belajar terbaik.
          </p>
        </div>

        {/* Repository */}
        <div>
          <h4 className="font-bold text-[#030B26] mb-4 text-sm tracking-wider uppercase">Source</h4>
          <ul className="space-y-3 text-slate-500 text-sm">
            <li className="flex items-center gap-3">
              <FiGithub size={18} /> 
              <a href="https://github.com/pytaa/CareerLens" target="_blank" rel="noopener noreferrer" className="hover:text-[#030B26] hover:underline transition-colors">
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>

        {/* Copyright & Logo */}
        <div className="flex flex-col items-start md:items-end justify-between">
           <div className="flex items-center mb-4 md:mb-0">
              <img 
                src={CareerLensLogo} 
                alt="CareerLens Logo" 
                className="h-8 md:h-10 object-contain" 
              />
           </div>
           <p className="text-sm text-slate-400 text-left md:text-right mt-4 md:mt-0">
             © 2026 .CareerLens. Personalize Your Career Roadmap.
           </p>
        </div>

      </div>
    </footer>
  );
};

export default ResultFooter;