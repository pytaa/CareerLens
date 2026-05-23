import React, { useState } from 'react';
import { 
  FiArrowLeft, 
  FiExternalLink, 
  FiMap, 
  FiBriefcase
} from 'react-icons/fi';
import { BiMoney } from 'react-icons/bi';

// KOMPONEN HEADER
const ResultHeader = ({ onBack }) => (
  <header className="w-full px-4 md:px-8 py-4 flex items-center border-b border-slate-100 shrink-0 sticky top-0 bg-white/90 backdrop-blur-md z-20">
    <button 
      onClick={onBack}
      className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
    >
      <FiArrowLeft size={18} /> Kembali ke Beranda
    </button>
    <div className="absolute left-1/2 -translate-x-1/2 font-extrabold text-xl text-[#000066] tracking-tight">
      CareerLens
    </div>
  </header>
);

// KOMPONEN FOOTER
const ResultFooter = () => (
  <footer className="w-full bg-white border-t border-slate-100 py-10 px-4 md:px-12 mt-auto">
    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-1">
        <h3 className="font-extrabold text-2xl text-[#000066] tracking-tight mb-4">CareerLens</h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
          Empowering professional growth through data-driven clarity.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-[#000066] mb-4 text-sm tracking-wider uppercase">Resources</h4>
        <ul className="space-y-3 text-slate-500 text-sm">
          <li><a href="#" className="hover:text-[#000066] transition-colors">Insights</a></li>
          <li><a href="#" className="hover:text-[#000066] transition-colors">Roadmaps</a></li>
          <li><a href="#" className="hover:text-[#000066] transition-colors">Courses</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-[#000066] mb-4 text-sm tracking-wider uppercase">Sectors</h4>
        <ul className="space-y-3 text-slate-500 text-sm">
          <li><a href="#" className="hover:text-[#000066] transition-colors">Technology</a></li>
          <li><a href="#" className="hover:text-[#000066] transition-colors">Finance</a></li>
          <li><a href="#" className="hover:text-[#000066] transition-colors">Healthcare</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-[#000066] mb-4 text-sm tracking-wider uppercase">Legal</h4>
        <ul className="space-y-3 text-slate-500 text-sm">
          <li><a href="#" className="hover:text-[#000066] transition-colors">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-[#000066] transition-colors">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    <div className="w-full mt-10 pt-6 border-t border-slate-100 text-xs text-slate-400">
      © 2026 CareerLens. All rights reserved.
    </div>
  </footer>
);

const MinatResult = ({ resultData, onBack, onRetake }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const dataInti = resultData?.data?.data || resultData?.data || resultData;
  const recommendations = dataInti?.recommendations;

  if (!resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-500 font-medium">Memuat hasil analisis dari AI...</div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="text-center text-red-500 font-medium">Gagal memuat struktur rekomendasi dari server.</div>
        <button onClick={onRetake} className="px-6 py-2 bg-[#000066] text-white rounded-lg">
          Kembali & Coba Lagi
        </button>
      </div>
    );
  }

  const activeRole = recommendations[activeIndex];

  const groupedRoadmap = activeRole?.roadmap?.learning_path?.reduce((acc, course) => {
    if (!acc[course.step]) acc[course.step] = [];
    acc[course.step].push(course);
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      
      <ResultHeader onBack={onBack} />

      <main className="grow flex flex-col md:flex-row w-full items-stretch">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-[320px] lg:w-85 shrink-0 flex flex-col z-10 pt-8 pb-8 pl-4 md:pl-8 pr-5 md:pr-6 border-r border-slate-200/60">
          <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-5 pl-1">
            Hasil Rekomendasi
          </h3>
          <div className="flex flex-col gap-3">
            {recommendations.map((rec, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={rec.role_id || idx}
                  onClick={() => setActiveIndex(idx)}
                  // REVISI: Padding disesuaikan, border dipertebal (border-[2px]) saat aktif, icon dihapus
                  className={`p-4 rounded-xl transition-all duration-300 text-left w-full ${
                    isActive 
                      ? 'border-2 border-[#000066] bg-[#F8FAFE] shadow-sm' 
                      : 'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`font-bold text-[15px] block ${isActive ? 'text-[#000066]' : 'text-slate-700'}`}>
                    {rec.role_name}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* BAGIAN KANAN */}
        <section className="w-full flex-1 flex flex-col">
          
          <div className="pt-8 pb-4 pl-6 md:pl-12 pr-4 md:pr-8">
            <h1 className="text-4xl md:text-[2.75rem] font-bold text-[#000066] mb-5 tracking-tight">
              {activeRole.role_name}
            </h1>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-4xl mb-8">
              {activeRole.description}
            </p>

            <div className="mb-8">
              <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-4">
                Keahlian Relevan
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeRole.skill_relevant?.map((skill, i) => (
                  // REVISI: Warna text skill menjadi #464651
                  <span key={i} className="px-4 py-2 bg-[#F7F9FB] text-[#464651] text-[13px] font-semibold rounded-full border border-slate-100 capitalize">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="inline-flex mb-8">
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#F7F9FB] border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-[#000066] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <BiMoney size={24} />
                </div>
                <div className="pr-4">
                  {/* REVISI: Warna tulisan Gaji Estimasi menjadi #464651, Nominal menjadi #191C1E dengan font-medium */}
                  <p className="text-[10px] font-bold text-[#464651] tracking-widest uppercase mb-0.5">Gaji Estimasi</p>
                  <p className="text-xl font-medium text-[#191C1E]">{activeRole.salary_range || "Menyesuaikan"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F7F9FB] flex-1 w-full pt-14 pb-12 pl-6 md:pl-12 pr-4 md:pr-8">
            
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-10">
                <FiMap className="text-[#000066]" size={30} />
                <h2 className="text-3xl font-bold text-[#000066]">Peta Jalan Belajar</h2>
              </div>

              <div className="relative border-l-2 border-slate-200 ml-4 md:ml-5 space-y-12 pb-4">
                {Object.keys(groupedRoadmap).map((stepNum) => (
                  <div key={stepNum} className="relative pl-8 md:pl-12">
                    <div className="absolute -left-4.25 md:-left-5.25 top-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#000066] text-white flex items-center justify-center font-bold text-sm md:text-base ring-4 ring-[#F7F9FB]">
                      {stepNum}
                    </div>

                    <h3 className="text-xl font-bold text-[#000066] mb-5 pt-1">Step {stepNum}</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-5xl">
                      {groupedRoadmap[stepNum].map((course, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3 gap-2">
                            <h4 className="font-bold text-[#000066] text-lg leading-tight">
                              {course.nama_skill}
                            </h4>
                            {/* REVISI: Warna tulisan platform kursus (Coursera dll) menjadi #464651 */}
                            <span className="shrink-0 bg-slate-100 text-[#464651] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                              {course.platform}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm mb-6 grow">{course.tipe}</p>
                          <a 
                            href={course.link_course} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#000066] hover:text-blue-600 transition-colors mt-auto"
                          >
                            Lihat Kursus <FiExternalLink size={16} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-8">
                <FiBriefcase className="text-[#000066]" size={28} />
                <h2 className="text-3xl font-bold text-[#000066]">Proyek Rekomendasi</h2>
              </div>

              <div className="flex flex-col gap-6 max-w-5xl">
                {activeRole.roadmap?.dummy_projects?.map((proj, idx) => {
                  const instructionsList = proj.instructions?.split(';').filter(Boolean) || [];
                  const toolsList = proj.tools_used?.split(';').filter(Boolean) || [];

                  return (
                    <div key={idx} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                      <h3 className="text-2xl font-bold text-[#000066] mb-3">{proj.judul}</h3>
                      <p className="text-slate-500 mb-8 max-w-3xl leading-relaxed">{proj.brief_case}</p>

                      <div className="mb-8">
                        <h4 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-4">Instruksi:</h4>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 text-[15px]">
                          {instructionsList.map((inst, i) => (
                            <li key={i}>{inst.trim()}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-4">Tools:</h4>
                        <div className="flex flex-wrap gap-2">
                          {toolsList.map((tool, i) => (
                            <span key={i} className="px-4 py-1.5 bg-[#F7F9FB] text-slate-700 text-[13px] font-semibold rounded-full border border-slate-100">
                              {tool.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* BOTTOM ACTION BAR */}
      <div className="w-full bg-[#000066] text-white py-5 px-4 md:px-12 z-20 shrink-0">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-lg md:text-xl font-bold mb-1">Hasil Analisis</h2>
            <p className="text-blue-200 text-xs md:text-sm">Dapatkan hasil analisis melalui email atau unduh langsung.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* REVISI: Hover state tombol diperhalus (bg hover, scale hover) */}
            <button 
              onClick={onRetake}
              className="flex-1 md:flex-none px-6 py-2.5 border border-blue-400 hover:bg-[#00004d] hover:border-[#00004d] rounded-xl font-bold transition-all duration-300 text-sm whitespace-nowrap"
            >
              Tes Ulang
            </button>
            <button className="flex-1 md:flex-none px-6 py-2.5 bg-white text-[#000066] hover:bg-slate-100 hover:-translate-y-0.5 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-xl text-sm whitespace-nowrap">
              Unduh PDF
            </button>
          </div>
        </div>
      </div>

      <ResultFooter />

    </div>
  );
};

export default MinatResult;