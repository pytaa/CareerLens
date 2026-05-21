import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FiChevronLeft, 
  FiCheckCircle, 
  FiActivity, 
  FiDollarSign,
  FiMap,
  FiBriefcase,
  FiTrendingUp,
  FiAlertTriangle,
  FiTarget
} from 'react-icons/fi';

// Fungsi helper untuk mengekstrak nama platform
const getPlatformName = (resourceStr) => {
  if (!resourceStr) return "UNKNOWN";
  if (resourceStr.startsWith('http')) {
    try {
      const domain = new URL(resourceStr).hostname;
      return domain.replace('www.', '').split('.')[0];
    } catch (e) {
      return "LINK";
    }
  }
  return resourceStr;
};

// Map tipe RIASEC ke deskripsi singkat untuk UI
const getRiasecTitle = (letter) => {
  const map = {
    'R': 'REALISTIC',
    'I': 'INVESTIGATIVE',
    'A': 'ARTISTIC',
    'S': 'SOCIAL',
    'E': 'ENTERPRISING',
    'C': 'CONVENTIONAL'
  };
  return map[letter] || letter;
};

const TesBakatResult = ({ data, interestCode, riasecScores }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [sendingReport, setSendingReport] = useState(false);

  // 1. Menggunakan Derived State
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  
  // 2. Mencari role aktif secara dinamis
  const activeRole = data?.recommendations?.find(r => r.role_id === selectedRoleId) || data?.recommendations?.[0];

  if (!data || !activeRole) {
    return (
      <div className="grow flex items-center justify-center text-slate-800 text-2xl font-bold bg-white w-full h-full min-h-screen">
        Menganalisis Bakat Anda...
      </div>
    );
  }

  const handleDownload = async () => {
    if (!email) return;
    setSendingReport(true);
    try {
      await axios.post('http://localhost:5000/api/reports/send', {
        email,
        user_id: data.user_id || null,
        profile: { name: data.user_name || data.name || '', email },
        summary: `Hasil analisis CareerLens menunjukkan peran terbaik untuk Anda adalah ${activeRole.role_name}.`,
        recommendations: data.recommendations || [],
        riasec_scores: riasecScores || undefined
      });
      alert(`Laporan PDF telah dikirim ke ${email}`);
      setShowModal(false);
      setEmail('');
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim laporan. Silakan coba kembali.');
    } finally {
      setSendingReport(false);
    }
  };

  // Kalkulasi untuk SVG Circular Progress
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (activeRole.match_pct / 100) * circumference;

  return (
    <div className="grow flex flex-col w-full bg-white relative min-h-screen">
      
      {/* --- HEADER ATAS --- */}
      <div className="w-full bg-white px-6 py-5 flex items-center justify-between border-b border-slate-200 shrink-0 relative z-10">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-slate-500 hover:text-[#030b26] font-medium text-sm transition-colors"
        >
          <FiChevronLeft size={18} /> Kembali ke Beranda
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 font-extrabold text-xl text-[#030b26] tracking-tight">
          CareerLens
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full grow">
        
        {/* --- SIDEBAR KIRI --- */}
        <div className="w-full md:w-1/4 bg-slate-50/50 border-r border-slate-200 p-6 md:p-8 flex flex-col shrink-0">
          
          <p className="text-xs font-bold text-slate-400 tracking-wider mb-4 uppercase">
            Hasil Rekomendasi
          </p>
          
          <div className="space-y-3 grow">
            {data.recommendations.map((role) => {
              const isActive = role.role_id === activeRole.role_id;
              
              return (
                <button 
                  key={role.role_id}
                  onClick={() => setSelectedRoleId(role.role_id)} 
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'border-2 border-[#030b26] bg-[#f8fafc] text-[#030b26] shadow-sm' 
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-[#e2e8f0]' : 'bg-slate-100'}`}>
                      <FiActivity size={18} className={isActive ? 'text-[#030b26]' : 'text-slate-500'} />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-sm text-slate-800">{role.role_name}</span>
                      <span className="text-[11px] font-bold text-slate-400">{role.match_pct}% Match</span>
                    </div>
                  </div>
                  {isActive && <FiCheckCircle size={18} className="text-[#030b26]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- KONTEN KANAN UTAMA --- */}
        <div className="w-full md:w-3/4 flex flex-col">
          
          {/* Header Role Terpilih & Grafik */}
          <div className="w-full p-8 md:p-12 border-b border-slate-200 flex flex-col md:flex-row items-center md:items-stretch gap-8 bg-white">
             {/* Grafik Lingkaran SVG */}
             <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
               <svg className="transform -rotate-90 w-40 h-40">
                 <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                 <circle 
                   cx="80" cy="80" r={radius} 
                   stroke="currentColor" strokeWidth="14" fill="transparent" 
                   strokeDasharray={circumference} 
                   strokeDashoffset={strokeDashoffset} 
                   strokeLinecap="round"
                   className="text-[#030b26] transition-all duration-1000 ease-out" 
                 />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                 <span className="text-3xl font-extrabold text-[#030b26] tracking-tight leading-none">{activeRole.match_pct}%</span>
                 <span className="text-[10px] font-bold text-slate-400 tracking-widest mt-1">MATCH</span>
               </div>
             </div>

             {/* Judul & Badge Info */}
             <div className="flex flex-col justify-center w-full">
               <h1 className="text-4xl md:text-5xl font-bold text-[#030b26] mb-4 text-center md:text-left tracking-tight">
                 {activeRole.role_name}
               </h1>
               <p className="text-slate-500 leading-relaxed mb-6 max-w-2xl text-sm md:text-base text-center md:text-left">
                 {activeRole.description}
               </p>
               
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                 <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-3 rounded-xl shadow-sm">
                   <FiDollarSign className="text-[#030b26] text-xl" />
                   <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gaji Estimasi</span>
                     <span className="text-sm font-bold text-slate-800">{activeRole.salary_range}</span>
                   </div>
                 </div>
                 
                 <div className="inline-flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-xl shadow-sm">
                   <FiTrendingUp className="text-emerald-600 text-xl" />
                   <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Prospek</span>
                     <span className="text-sm font-bold text-emerald-800">Sangat Tinggi</span>
                   </div>
                 </div>
               </div>
             </div>
          </div>

          {/* Area Konten Bawah (Scrollable) */}
          <div className="p-8 md:p-12 overflow-y-auto bg-slate-50/30 flex-1">
             
             {/* --- INTEREST CODE (RIASEC) --- */}
             <div className="mb-14 max-w-4xl">
               <h3 className="text-2xl font-bold text-slate-800 mb-8">Your Interest Code</h3>
               
               <div className="flex flex-wrap items-center gap-12 md:gap-20 mb-8">
                 {interestCode.slice(0, 3).map((letter, index) => (
                   <div key={index} className="flex flex-col items-center">
                     <span className="text-6xl md:text-7xl font-extrabold text-[#1e3a8a] mb-2 leading-none">
                       {letter}
                     </span>
                     <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                       {getRiasecTitle(letter)}
                     </span>
                   </div>
                 ))}
               </div>
               
               <div className="bg-sky-50/50 border border-sky-100 p-6 rounded-2xl shadow-sm max-w-3xl">
                  <p className="text-sm text-slate-600 italic font-medium leading-relaxed">
                    "Berdasarkan analisis model kami, Anda memiliki fondasi teknis yang kuat dengan bakat kreatif yang menonjol. Karakter ini sangat cocok untuk peran analitis yang membutuhkan pemecahan masalah."
                  </p>
               </div>
             </div>

             {/* --- PETA JALAN BELAJAR --- */}
             <div className="mb-14 max-w-4xl">
               <div className="flex items-center gap-3 mb-8">
                 <div className="bg-slate-200/50 text-[#030b26] p-2.5 rounded-xl">
                   <FiMap size={22} />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-800">Peta Jalan Belajar</h3>
               </div>

               <div className="space-y-0 pl-2">
                 {activeRole.roadmap.learning_path.map((step, index) => {
                   const isLast = index === activeRole.roadmap.learning_path.length - 1;
                   return (
                     <div key={index} className="flex gap-5">
                       <div className="flex flex-col items-center">
                         <div className="w-8 h-8 shrink-0 rounded-full bg-[#030b26] text-white flex items-center justify-center font-bold text-sm z-10 shadow-md">
                           {step.step}
                         </div>
                         {!isLast && <div className="w-px h-full bg-slate-200 mt-2 min-h-[4rem]"></div>}
                       </div>
                       <div className="flex-1 pb-10">
                         <div className="flex justify-between items-start">
                           <div className="pr-6">
                             <h4 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h4>
                             <p className="text-slate-500 text-sm mb-3">
                               Pelajari materi inti terkait {step.title.toLowerCase()} untuk memperkuat fondasi Anda.
                             </p>
                             <a
                               href={step.resource.startsWith('http') ? step.resource : '#'}
                               target={step.resource.startsWith('http') ? "_blank" : "_self"}
                               rel="noreferrer"
                               className="text-[#1e3a8a] font-bold text-sm hover:underline flex items-center gap-1"
                             >
                               Mulai Belajar <span>➔</span>
                             </a>
                           </div>
                           <div className="bg-slate-200/50 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest shrink-0 shadow-sm border border-slate-200">
                             {getPlatformName(step.resource)}
                           </div>
                         </div>
                       </div>
                     </div>
                   );
                 })}
               </div>
             </div>

             {/* --- SKILL GAP --- */}
             {activeRole.skill_gap && activeRole.skill_gap.length > 0 && (
               <div className="mb-14 max-w-4xl">
                 <div className="flex items-center gap-3 mb-6 text-red-500">
                   <FiAlertTriangle size={24} />
                   <h3 className="text-2xl font-bold text-slate-800">Kesenjangan Keterampilan (Skill Gap)</h3>
                 </div>
                 
                 <div className="bg-red-50/80 border border-red-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm">
                    <div className="bg-white text-red-500 p-4 rounded-xl shadow-sm shrink-0 border border-red-100">
                      <FiTarget size={28} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-3">
                        Keterampilan Yang Perlu Dipelajari
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeRole.skill_gap.map((gap, index) => (
                          <span key={index} className="bg-white border border-red-200 text-red-600 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                            {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                 </div>
               </div>
             )}

             {/* --- PROYEK REKOMENDASI --- */}
             <div className="mb-8 flex items-center gap-3">
               <div className="bg-slate-200/50 text-[#030b26] p-2.5 rounded-xl">
                 <FiBriefcase size={22} />
               </div>
               <h3 className="text-2xl font-bold text-slate-800">Proyek Rekomendasi</h3>
             </div>

             <div className="flex flex-col gap-4 max-w-4xl">
                {activeRole.roadmap.dummy_projects.map((project, index) => (
                   <div key={index} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                      <h6 className="font-bold text-slate-900 text-base mb-1">{project}</h6>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        Kerjakan proyek simulasi ini untuk memperkuat portofolio dan pemahaman praktikal Anda terkait studi kasus di dunia nyata.
                      </p>
                   </div>
                ))}
             </div>

          </div>
        </div>
      </div>

      {/* --- BARIS BAWAH & TOMBOL AKSI --- */}
      <div className="w-full bg-[#030b26] text-white p-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 shrink-0">
         <div className="text-center md:text-left">
            <h4 className="font-bold text-lg">Hasil Analisis</h4>
            <p className="text-xs md:text-sm text-blue-100">Dapatkan hasil analisis melalui email atau unduh langsung.</p>
         </div>
         
         <div className="flex items-center gap-3 w-full md:w-auto">
           <button 
             onClick={() => navigate(0)} 
             className="flex-1 md:flex-none border border-white/30 text-white px-8 py-2 md:py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors shadow-sm"
           >
             Tes Ulang
           </button>
           <button 
             onClick={() => setShowModal(true)}
             className="flex-1 md:flex-none bg-white text-slate-900 px-8 py-2 md:py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors shadow-sm"
           >
             Unduh PDF
           </button>
         </div>
      </div>

      {/* --- MODAL POPUP EMAIL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
           <div className="bg-[#030b26] p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md text-white relative border border-slate-700">
              <div className="flex items-center gap-4 mb-8">
                 <button onClick={() => setShowModal(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                   <FiChevronLeft size={24} />
                 </button>
                 <h3 className="text-2xl font-bold">Data Pengguna</h3>
              </div>
              <p className="mb-4 text-sm text-slate-300">Masukkan E-mail Anda untuk mengunduh hasil</p>
              <input 
                type="email" 
                placeholder="Masukkan Alamat E-mail *" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl mb-8 text-slate-900 font-medium outline-none focus:ring-4 focus:ring-blue-500/50 transition-all placeholder:text-slate-400 bg-white"
              />
              <div className="flex justify-center">
                <button 
                  onClick={handleDownload}
                  disabled={!email || sendingReport}
                  className="bg-[#0277b6] hover:bg-[#026296] disabled:opacity-50 disabled:cursor-not-allowed px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all w-full"
                >
                  {sendingReport ? 'Mengirim...' : 'Kirim dan Unduh'}
                </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default TesBakatResult;