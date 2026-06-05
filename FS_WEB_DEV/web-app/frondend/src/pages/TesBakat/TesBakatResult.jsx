import React, { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiExternalLink,
  FiMap,
  FiBriefcase,
  FiMenu,
  FiX,
  FiLayers,
  FiDatabase,
  FiPenTool,
  FiTrendingUp,
  FiMail // Tambahan ikon untuk modal email
} from "react-icons/fi";
import IconUang from "../../../assets/iconUang.png";
import ResultFooter from "../../components/ResultFooter.jsx";
import ResultHeader from "../../components/ResultHeader";

// Ikon dinamis untuk sektor relevan 
const sectorIcons = [FiLayers, FiDatabase, FiPenTool, FiTrendingUp, FiBriefcase];

const TesBakatResult = ({ resultData, payloadScores, onBack, onRetake }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // ======== STATE BARU UNTUK POP-UP EMAIL ========
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const dataInti = resultData?.data?.data || resultData?.data || resultData;
  const recommendations = dataInti?.recommendations;
  const chartData = dataInti?.chart_data;
  const interestCode = dataInti?.interest_code;
  const sectorRecommendations = dataInti?.sector_recommendations;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 100); 
    return () => clearTimeout(timer);
  }, [activeIndex]);

  // ======== FUNGSI KONFIRMASI EMAIL ========
  const [isSendingPdf, setIsSendingPdf] = useState(false);

  const handleConfirmEmail = async () => {
    if (!emailInput) {
      alert("Harap masukkan alamat email.");
      return;
    }
    
    setIsSendingPdf(true);
    try {
      const userId = localStorage.getItem('careerlens_user_id');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pdf/bakat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          reqData: { payload: { riasec_scores: payloadScores } },
          resData: resultData,
          userId: userId
        })
      });

      const jsonResponse = await response.json();
      if (jsonResponse.status === 'success') {
        alert(`Berhasil! Laporan analisis PDF telah dikirim ke: ${emailInput}\n\nMohon periksa juga folder Spam atau Promosi jika email tidak ditemukan di Kotak Masuk utama Anda.`);
        setIsEmailModalOpen(false);
        setEmailInput("");
      } else {
        alert("Gagal mengirim email: " + jsonResponse.message);
      }
    } catch (error) {
      console.error("Error sending PDF:", error);
      alert("Terjadi kesalahan saat menghubungi server untuk pengiriman PDF.");
    } finally {
      setIsSendingPdf(false);
    }
  };

  if (!resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-500 font-medium">
          Memuat hasil analisis dari AI...
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="text-center text-red-500 font-medium">
          Gagal memuat struktur rekomendasi dari server.
        </div>
        <button
          onClick={onRetake}
          className="px-6 py-2 bg-[#000066] text-white rounded-lg"
        >
          Kembali & Coba Lagi
        </button>
      </div>
    );
  }

  const activeRole = recommendations[activeIndex];

  const groupedRoadmap =
    activeRole?.roadmap?.learning_path?.reduce((acc, course) => {
      if (!acc[course.step]) acc[course.step] = [];
      acc[course.step].push(course);
      return acc;
    }, {}) || {};

  const circleRadius = 65;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeOffset = showAnimation 
    ? circleCircumference - (activeRole.match_pct / 100) * circleCircumference 
    : circleCircumference;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col relative overflow-x-hidden">
      <ResultHeader onBack={onBack} />

      <main className="grow flex flex-col md:flex-row w-full items-stretch relative">
        
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside 
          className={`
            fixed md:relative inset-y-0 left-0 z-50 w-[85%] sm:w-[320px] lg:w-85 
            bg-white md:bg-transparent shadow-2xl md:shadow-none
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            shrink-0 flex flex-col pt-8 pb-8 pl-6 md:pl-8 pr-6 border-r border-slate-200/60 overflow-y-auto
          `}
        >
          <div className="flex items-center justify-between mb-5 pl-1">
            <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              Hasil Rekomendasi
            </h3>
            <button 
              className="md:hidden p-2 text-slate-400 hover:text-red-500 rounded-lg bg-slate-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {recommendations.map((rec, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={rec.role_id || idx}
                  onClick={() => {
                    if (!isActive) {
                      setShowAnimation(false);
                      setActiveIndex(idx);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-4 rounded-xl transition-all duration-300 text-left w-full flex items-center justify-between gap-3 ${
                    isActive
                      ? "border-2 border-[#000066] bg-[#F8FAFE] shadow-sm"
                      : "border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`font-bold text-[14px] md:text-[15px] leading-tight ${isActive ? "text-[#000066]" : "text-slate-700"}`}
                  >
                    {rec.role_name}
                  </span>
                  <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-md ${
                    isActive ? "bg-[#E2E6F0] text-[#000066]" : "bg-slate-100 text-slate-500"
                  }`}>
                    {rec.match_pct}%
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="w-full flex-1 flex flex-col min-w-0">
          <div className="pt-8 pb-4 pl-6 md:pl-12 pr-6 md:pr-8">
            
            <div className="md:hidden mb-6">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="inline-flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-[#000066] hover:bg-slate-50 transition-colors"
              >
                <FiMenu size={24} />
              </button>
            </div>

            {/* ======== INTEREST CODE ======== */}
            {interestCode && (
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#E2E6F0] text-[#000066] text-xs font-bold rounded-md tracking-[0.2em]">
                  {interestCode}
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  Interest Code
                </span>
              </div>
            )}

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
                  <span
                    key={i}
                    className="px-4 py-2 bg-[#F7F9FB] text-[#464651] text-[13px] font-semibold rounded-full border border-slate-100 capitalize"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="inline-flex mb-12">
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#F7F9FB] border border-slate-100">
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <img src={IconUang} alt="Ikon Uang" className="w-8 h-8 object-contain" />
                </div>
                <div className="pr-4">
                  <p className="text-[10px] font-bold text-[#464651] tracking-widest uppercase mb-0.5">
                    Gaji Estimasi
                  </p>
                  <p className="text-xl font-medium text-[#191C1E]">
                    {activeRole.salary_range || "Menyesuaikan"}
                  </p>
                </div>
              </div>
            </div>

            {/* ======== ANALISIS KECOCOKAN PERAN ======== */}
            <div className="mb-10 w-full border border-slate-200 rounded-2xl p-6 md:p-10 bg-white shadow-sm flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="shrink-0 relative flex flex-col items-center justify-center w-36 h-36 md:w-44 md:h-44">
                <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full -rotate-90 origin-center">
                  <circle 
                    cx="80" cy="80" r={circleRadius} 
                    className="text-slate-100" 
                    strokeWidth="12" stroke="currentColor" fill="transparent" 
                  />
                  <circle 
                    cx="80" cy="80" r={circleRadius} 
                    className="text-[#000066] transition-[stroke-dashoffset] duration-[1200ms] ease-in-out" 
                    strokeWidth="12" 
                    strokeDasharray={circleCircumference} 
                    strokeDashoffset={strokeOffset} 
                    strokeLinecap="round" 
                    stroke="currentColor" fill="transparent" 
                  />
                </svg>
                <div className="relative flex flex-col items-center justify-center">
                  <p className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#000066]">
                    {activeRole.match_pct}%
                  </p>
                  <p className="text-[10px] md:text-xs uppercase tracking-wider font-bold text-slate-500 mt-1">
                    Match
                  </p>
                </div>
              </div>
              
              <div className="flex-1 w-full flex flex-col gap-5">
                <h3 className="text-xl font-bold text-[#000066] mb-2 hidden md:block">
                  Analisis Kecocokan Peran
                </h3>
                {chartData?.labels?.map((label, index) => {
                  const isCurrentRole = label === activeRole.role_name;
                  return (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="flex justify-between text-sm md:text-base font-bold">
                        <span className={`${isCurrentRole ? 'text-[#000066]' : 'text-[#000066]/60'} truncate pr-4 transition-colors duration-500`}>
                          {label}
                        </span>
                        <span className="text-slate-500 shrink-0">
                          {chartData.scores[index]}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 md:h-3 rounded-full overflow-hidden">
                        <div 
                          className={`${isCurrentRole ? 'bg-[#000066]' : 'bg-[#000066]/30'} h-full rounded-full transition-colors duration-500 ease-in-out`} 
                          style={{ width: `${chartData.scores[index]}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ======== SEKTOR YANG RELEVAN ======== */}
            {sectorRecommendations && sectorRecommendations.length > 0 && (
              <div className="mb-10 w-full border border-slate-200 rounded-2xl p-6 md:p-10 bg-white shadow-sm">
                <h3 className="text-xl font-bold text-[#000066] mb-6">
                  Sektor yang Relevan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectorRecommendations.map((sector, i) => {
                    const SectorIcon = sectorIcons[i % sectorIcons.length];
                    return (
                      <div 
                        key={i} 
                        className="flex items-center justify-between p-4 md:p-5 rounded-xl bg-[#F7F9FB] border border-slate-100 transition-shadow hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-[#000066]">
                            <SectorIcon size={18} />
                          </div>
                          <span className="font-bold text-[#191C1E] text-sm md:text-[15px]">
                            {sector.field_name}
                          </span>
                        </div>
                        <span className="font-extrabold text-[#000066] text-sm shrink-0 pl-3">
                          {sector.relevance_pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          <div className="bg-[#F7F9FB] flex-1 w-full pt-12 md:pt-14 pb-12 pl-6 md:pl-12 pr-6 md:pr-8">
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-10">
                <FiMap className="text-[#000066]" size={30} />
                <h2 className="text-2xl md:text-3xl font-bold text-[#000066]">
                  Peta Jalan Belajar
                </h2>
              </div>

              <div className="relative border-l-2 border-slate-200 ml-4 md:ml-5 space-y-12 pb-4">
                {Object.keys(groupedRoadmap).map((stepNum) => (
                  <div key={stepNum} className="relative pl-8 md:pl-12">
                    <div className="absolute -left-[17px] md:-left-[21px] top-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#000066] text-white flex items-center justify-center font-bold text-sm md:text-base ring-4 ring-[#F7F9FB]">
                      {stepNum}
                    </div>

                    <h3 className="text-xl font-bold text-[#000066] mb-5 pt-1">
                      Step {stepNum}
                    </h3>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 max-w-5xl">
                      {groupedRoadmap[stepNum].map((course, idx) => {
                        const titleParts = course.nama_skill?.split(" - ") || [];
                        const hasCategory = titleParts.length > 1;
                        const categoryName = hasCategory ? titleParts[0] : null;
                        const courseName = hasCategory ? titleParts.slice(1).join(" - ") : course.nama_skill;

                        return (
                        <div
                          key={idx}
                          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-wrap md:flex-nowrap justify-between items-start mb-3 gap-2">
                            <div className="flex flex-col gap-1.5">
                              {categoryName && (
                                <span className="text-[#3b82f6] text-[11px] font-bold uppercase tracking-wider">
                                  {categoryName}
                                </span>
                              )}
                              <h4 className="font-bold text-[#000066] text-lg leading-tight">
                                {courseName}
                              </h4>
                            </div>
                            <span className="shrink-0 bg-slate-100 text-[#464651] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mt-1 md:mt-0">
                              {course.platform}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm mb-6 grow">
                            {course.tipe}
                          </p>
                          <a
                            href={course.link_course}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#000066] hover:text-blue-600 transition-colors mt-auto"
                          >
                            Lihat Kursus <FiExternalLink size={16} />
                          </a>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-8">
                <FiBriefcase className="text-[#000066]" size={28} />
                <h2 className="text-2xl md:text-3xl font-bold text-[#000066]">
                  Proyek Rekomendasi
                </h2>
              </div>

              <div className="flex flex-col gap-6 max-w-5xl">
                {activeRole.roadmap?.dummy_projects?.map((proj, idx) => {
                  const instructionsList = proj.instructions?.split(";").filter(Boolean) || [];
                  const toolsList = proj.tools_used?.split(";").filter(Boolean) || [];

                  return (
                     <div key={idx} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
                      <h3 className="text-xl md:text-2xl font-bold text-[#000066] mb-3">
                        {proj.judul}
                      </h3>
                      <p className="text-slate-500 mb-8 max-w-3xl leading-relaxed text-sm md:text-base">
                        {proj.brief_case}
                      </p>

                      <div className="mb-8">
                        <h4 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-4">
                          Instruksi:
                        </h4>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 text-[14px] md:text-[15px]">
                          {instructionsList.map((inst, i) => (
                            <li key={i}>{inst.trim()}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-4">
                          Tools:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {toolsList.map((tool, i) => (
                            <span key={i} className="px-4 py-1.5 bg-[#F7F9FB] text-[#464651] text-[13px] font-semibold rounded-full border border-slate-100">
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
      <div className="w-full bg-[#000066] text-white py-6 px-6 md:px-12 z-20 shrink-0">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-lg md:text-xl font-bold mb-1">
              Hasil Analisis
            </h2>
            <p className="text-blue-200 text-xs md:text-sm">
              Dapatkan hasil analisis melalui email atau unduh langsung.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onRetake}
              className="flex-1 md:flex-none px-6 py-2.5 border border-blue-400 hover:bg-[#00004d] hover:border-[#00004d] rounded-xl font-bold transition-all duration-300 text-sm whitespace-nowrap"
            >
              Tes Ulang
            </button>
            <button 
              onClick={() => setIsEmailModalOpen(true)}
              className="flex-1 md:flex-none px-6 py-2.5 bg-white text-[#000066] hover:bg-slate-100 hover:-translate-y-0.5 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-xl text-sm whitespace-nowrap"
            >
              Unduh PDF
            </button>
          </div>
        </div>
      </div>

      <ResultFooter />

      {/* ======== MODAL EMAIL POP-UP ======== */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsEmailModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <FiX size={24} />
            </button>
            
            <h3 className="text-[22px] font-bold text-[#000066] mb-3 pr-8">
              Unduh Hasil Analisis
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Masukkan email Anda untuk menerima salinan hasil analisis karir dalam format PDF.
            </p>

            <div className="mb-8">
              <label className="block text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                Email
              </label>
              <input 
                type="email" 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="contoh@email.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#000066]/20 focus:border-[#000066] transition-all text-sm"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConfirmEmail}
                disabled={isSendingPdf}
                className="w-full py-3.5 bg-[#000066] text-white font-bold rounded-xl hover:bg-[#00004d] transition-colors disabled:bg-slate-400"
              >
                {isSendingPdf ? 'Mengirim...' : 'Konfirmasi'}
              </button>
              <button 
                onClick={() => setIsEmailModalOpen(false)}
                className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TesBakatResult;