// src/components/ResultFooter.jsx
import React from 'react';

const ResultFooter = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-100 py-10 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <h3 className="font-extrabold text-2xl text-[#030B26] tracking-tight mb-4">CareerLens</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Empowering professional growth through data-driven clarity.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-[#030B26] mb-4 text-sm tracking-wider uppercase">Resources</h4>
          <ul className="space-y-3 text-slate-500 text-sm">
            <li><a href="#" className="hover:text-[#030B26] transition-colors">Insights</a></li>
            <li><a href="#" className="hover:text-[#030B26] transition-colors">Roadmaps</a></li>
            <li><a href="#" className="hover:text-[#030B26] transition-colors">Courses</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#030B26] mb-4 text-sm tracking-wider uppercase">Sectors</h4>
          <ul className="space-y-3 text-slate-500 text-sm">
            <li><a href="#" className="hover:text-[#030B26] transition-colors">Technology</a></li>
            <li><a href="#" className="hover:text-[#030B26] transition-colors">Finance</a></li>
            <li><a href="#" className="hover:text-[#030B26] transition-colors">Healthcare</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[#030B26] mb-4 text-sm tracking-wider uppercase">Legal</h4>
          <ul className="space-y-3 text-slate-500 text-sm">
            <li><a href="#" className="hover:text-[#030B26] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#030B26] transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-100 text-xs text-slate-400">
        © 2026 CareerLens. All rights reserved.
      </div>
    </footer>
  );
};

export default ResultFooter;