import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FiChevronLeft, 
  FiCheckCircle, 
  FiActivity, 
  FiDollarSign,
  FiMap,
  FiBriefcase
} from 'react-icons/fi';

// buat pisahin url dan source
const getPlatformName = (resourceStr) => {
  if (!resourceStr) return "UNKNOWN";
  
  if (resourceStr.startsWith('http')) {
    try {
      const domain = new URL(resourceStr).hostname;
      const name = domain.replace('www.', '').split('.')[0];
      return name;
    } catch (e) {
      return "LINK";
    }
  }
  
  return resourceStr;
};

const MinatResult = ({ data }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [sendingReport, setSendingReport] = useState(false);

  // 1. Menggunakan Derived State (Tanpa useEffect)
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  
  // 2. Otomatis mencari role yang dipilih, atau gunakan role pertama sebagai default
  const activeRole = data?.recommendations?.find(r => r.role_id === selectedRoleId) || data?.recommendations?.[0];

  if (!data || !activeRole) {
    return (
      <div className="grow flex items-center justify-center text-slate-800 text-2xl font-bold bg-white w-full h-full min-h-screen">
        Menganalisis Minat Anda...
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
        profile: {
          name: data.user_name || data.name || '',
          email
        },
        summary: `CareerLens merekomendasikan peran ${activeRole.role_name} berdasarkan hasil minat Anda.`,
        recommendations: data.recommendations || []
      });
      alert(`Laporan PDF telah dikirim ke ${email}`);
      setShowModal(false);
      setEmail('');
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim laporan. Silakan coba lagi.');
    } finally {
      setSendingReport(false);
    }
  };

  return (
    <div className="grow flex flex-col w-full bg-white relative min-h-screen">
      
      {/* --- HEADER ATAS --- */}
      <div className="w-full bg-white px-6 py-5 flex items-center justify-between border-b border-slate-200 shrink-0 relative">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-slate-500 hover:text-[#1e3a8a] font-medium text-sm transition-colors z-10"
        >
          <FiChevronLeft size={18} /> Kembali ke Beranda
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 font-extrabold text-xl text-[#1e3a8a] tracking-tight">
          CareerLens
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full grow">
        
        {/* --- SIDEBAR KIRI --- */}
        <div className="w-full md:w-1/4 bg-slate-50/50 border-r border-slate-200 p-6 md:p-8 flex flex-col">
          
          <p className="text-xs font-bold text-slate-400 tracking-wider mb-4 uppercase">
            Hasil Rekomendasi
          </p>
          
          <div className="space-y-3 grow">
            {data.recommendations.map((role) => {
              const isActive = role.role_id === activeRole.role_id;
              
              return (
                <button 
                  key={role.role_id}
                  // 3. Mengubah cara tombol memperbarui state
                  onClick={() => setSelectedRoleId(role.role_id)} 
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'border-2 border-[#1e3a8a] bg-[#f8fafc] text-[#1e3a8a] shadow-sm' 
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-[#e2e8f0]' : 'bg-slate-100'}`}>
                      <FiActivity size={18} className={isActive ? 'text-[#1e3a8a]' : 'text-slate-500'} />
                    </div>
                    <span className="font-bold text-sm">{role.role_name}</span>
                  </div>
                  
                  {isActive && (
                    <FiCheckCircle size={18} className="text-[#1e3a8a]" />
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* --- KONTEN KANAN --- */}
        <div className="w-full md:w-3/4 p-8 md:p-12 overflow-y-auto bg-white transition-all duration-500">
           
           {/* Judul & Deskripsi Utama */}
           <h1 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-4 text-center md:text-left">
             {activeRole.role_name}
           </h1>
           
           <p className="text-slate-600 leading-relaxed mb-6 max-w-3xl text-sm md:text-base">
             {activeRole.description}
           </p>

           {/* Badge Gaji Estimasi */}
           <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-3 rounded-xl mb-12 shadow-sm">
             <FiDollarSign className="text-[#1e3a8a] text-xl" />
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gaji Estimasi</span>
               <span className="text-sm font-bold text-slate-800">{activeRole.salary_range}</span>
             </div>
           </div>

           {/* --- PETA JALAN BELAJAR --- */}
           <div className="mb-14">
             <div className="flex items-center gap-3 mb-8">
               <div className="bg-slate-100 text-[#1e3a8a] p-2.5 rounded-xl">
                 <FiMap size={22} />
               </div>
               <h3 className="text-2xl font-bold text-slate-800">Peta Jalan Belajar</h3>
             </div>

             <div className="space-y-0 pl-2">
               {activeRole.roadmap.learning_path.map((step, index) => {
                 const isLast = index === activeRole.roadmap.learning_path.length - 1;
                 
                 return (
                   <div key={index} className="flex gap-5">
                     
                     {/* Kolom Kiri: Lingkaran & Garis */}
                     <div className="flex flex-col items-center">
                       <div className="w-8 h-8 shrink-0 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm z-10 shadow-md">
                         {step.step}
                       </div>
                       {!isLast && <div className="w-px h-full bg-slate-200 mt-2 min-h-16"></div>}
                     </div>

                     {/* Kolom Kanan: Konten */}
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

                         {/* Badge Nama Platform */}
                         <div className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest shrink-0 shadow-sm">
                           {getPlatformName(step.resource)}
                         </div>
                         
                       </div>
                     </div>

                   </div>
                 );
               })}
             </div>
           </div>

           {/* --- PROYEK REKOMENDASI --- */}
           <div className="mb-8 flex items-center gap-3">
             <div className="bg-slate-100 text-[#1e3a8a] p-2.5 rounded-xl">
               <FiBriefcase size={22} />
             </div>
             <h3 className="text-2xl font-bold text-slate-800">Proyek Rekomendasi</h3>
           </div>

           <div className="flex flex-col gap-4 pb-12">
              {activeRole.roadmap.dummy_projects.map((project, index) => (
                 <div key={index} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-md transition-all">
                    <h6 className="font-bold text-slate-900 text-base mb-1">{project}</h6>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Kerjakan proyek simulasi ini untuk memperkuat portofolio dan pemahaman praktikal Anda terkait studi kasus di dunia nyata.
                    </p>
                 </div>
              ))}
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
                 <button 
                   onClick={() => setShowModal(false)}
                   className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                 >
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

export default MinatResult;