import React from 'react';
import { FiInstagram, FiMessageCircle, FiMail, FiPhone, FiMapPin, FiBriefcase } from 'react-icons/fi';
// Impor logo custom milikmu
import logoIcon from '../../assets/careerLens_logo_1.png'; 

const Footer = () => {
  return (
    <footer className="bg-[#030b26] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact Details */}
        <div>
          <h3 className="text-xl font-bold mb-6">Contact Details</h3>
          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex items-center gap-3"><FiInstagram size={18} /> CareerLens_</li>
            <li className="flex items-center gap-3"><FiMessageCircle size={18} /> 081234567899</li>
            <li className="flex items-center gap-3"><FiMail size={18} /> <a href="mailto:careerlens@gmail.com" className="underline hover:text-white">careerlens@gmail.com</a></li>
            <li className="flex items-center gap-3"><FiPhone size={18} /> 081234567899</li>
          </ul>
        </div>

        {/* Company Name */}
        <div>
          <h3 className="text-xl font-bold mb-6">Company Name</h3>
          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex items-center gap-3"><FiBriefcase size={18} /> CareerLens Corp.</li>
            <li className="flex items-center gap-3"><FiMapPin size={18} /> Indonesia</li>
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