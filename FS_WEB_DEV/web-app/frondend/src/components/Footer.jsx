import React from 'react';
import { FiGithub } from 'react-icons/fi';
// Impor logo custom milikmu
import logoIcon from '../../assets/careerLens_logo_1.png'; 

const Footer = () => {
  return (
    <footer className="bg-[#030b26] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Credits */}
        <div>
          <h3 className="text-xl font-bold mb-6">Credits</h3>
          <p className="text-sm text-slate-300 leading-relaxed pr-4">
            Aplikasi ini dikembangkan oleh Tim CareerLens sebagai proyek akhir (Capstone Project). Kami berdedikasi untuk membantu generasi muda menemukan jalur karir dan peta jalan belajar terbaik.
          </p>
        </div>

        {/* Repository */}
        <div>
          <h3 className="text-xl font-bold mb-6">Source</h3>
          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex items-center gap-3">
              <FiGithub size={18} /> 
              <a href="https://github.com/pytaa/CareerLens" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition-colors">
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>

        {/* Copyright & Logo */}
        <div className="flex flex-col items-start md:items-end justify-between">
           
           <div className="flex items-center mb-4 md:mb-0">
              <img 
                src={logoIcon} 
                alt="CareerLens Logo" 
                className="h-10 w-auto object-contain" 
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

export default Footer;