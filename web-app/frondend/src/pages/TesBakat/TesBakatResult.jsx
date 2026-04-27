import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiAlertCircle } from 'react-icons/fi';

const TesBakatResult = ({ data, interestCode }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [activeRole, setActiveRole] = useState(null);

  useEffect(() => {
    if (data && data.recommendations && data.recommendations.length > 0) {
      setActiveRole(data.recommendations[0]);
    }
  }, [data]);

  if (!data || !activeRole) {
    return (
      <div className="grow flex items-center justify-center text-slate-800 text-2xl font-bold bg-white w-full h-full min-h-125">
        Menganalisis Bakat Anda...
      </div>
    );
  }

  const handleDownload = () => {
    alert(`Mensimulasikan pengiriman PDF ke: ${email}`);
    setShowModal(false);
    setEmail('');
  };

  return (
    <div className="grow flex flex-col w-full bg-white relative">
      <div className="flex flex-col md:flex-row w-full grow border-t border-slate-200">
        
        {/* Sidebar Kiri */}
        <div className="w-full md:w-1/4 bg-slate-50 border-r border-slate-200 p-6 md:p-8 flex flex-col">
          <div className="mb-8">
            <h2 className="font-bold text-lg text-slate-800 mb-3 border-b border-slate-300 pb-2 text-center md:text-left">Your Interest Code</h2>
            <div className="flex justify-center items-center gap-4 py-4">
              {interestCode.map((letter, index) => (
                <span key={index} className="text-5xl md:text-6xl font-extrabold text-[#0277b6]">
                  {letter}
                </span>
              ))}
            </div>
            <div className="bg-cyan-100 p-4 rounded-xl mt-4 shadow-sm">
               <p className="text-sm text-slate-700 italic font-medium text-center">
                 "Berdasarkan analisis model kami, Anda memiliki fondasi teknis yang kuat dengan bakat analitis yang menonjol."
               </p>
            </div>
          </div>

          <h2 className="font-bold text-lg text-slate-800 mb-1">Bidang Sektor Industri</h2>
          <p className="text-[#0277b6] font-bold text-lg mb-8">Data Science & Artificial Intelligence</p>
          
          <h3 className="font-bold text-slate-800 text-lg mb-4">Rekomendasi Karir</h3>
          
          <div className="space-y-4 grow">
            {data.recommendations.map((role) => (
              <button 
                key={role.role_id}
                onClick={() => setActiveRole(role)}
                className={`w-full text-left px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                  role.role_id === activeRole.role_id 
                    ? 'bg-[#0277b6] text-white shadow-md translate-x-2' 
                    : 'bg-cyan-100 text-[#0277b6] hover:bg-cyan-200 hover:translate-x-1'
                }`}
              >
                {role.role_name}
              </button>
            ))}
          </div>

          <div className="mt-8">
             <button 
               onClick={() => navigate(0)} 
               className="bg-[#0b1234] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-900 shadow-md transition-all w-full"
             >
               Mulai Analisis Baru
             </button>
          </div>
        </div>

        {/* Konten Kanan */}
        <div className="w-full md:w-3/4 p-8 md:p-12 overflow-y-auto bg-white">
           <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{activeRole.role_name}</h1>

           {/* PERBAIKAN: Ditambahkan whitespace-nowrap agar tidak 2 baris */}
           <div className="flex items-center gap-4 mb-10">
              <span className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm whitespace-nowrap">
                High Match
              </span>
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#0277b6] rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${activeRole.match_pct}%` }}
                ></div>
              </div>
              <span className="font-bold text-[#0277b6]">{activeRole.match_pct}%</span>
           </div>
           
           <div className="flex flex-col md:flex-row gap-8 mb-10 border-b border-slate-200 pb-8">
              <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-800 mb-2">Deskripsi Peran :</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{activeRole.description}</p>
              </div>
              <div className="flex-1 md:border-l border-slate-200 md:pl-8">
                <h4 className="font-bold text-sm text-slate-800 mb-2">Penghasilan:</h4>
                <p className="text-slate-600 text-sm leading-relaxed">Sekitar {activeRole.salary_range} menurut rata-rata industri di Indonesia.</p>
              </div>
           </div>

           <div className="mb-6"><span className="bg-[#0b1234] text-white px-6 py-2 rounded-xl font-bold text-sm">Rekomendasi Road Map</span></div>
           <div className="space-y-6 mb-12 pl-3">
              {activeRole.roadmap.learning_path.map((step, index) => (
                 <div key={index} className="border-l-2 border-[#0277b6] pl-6 relative">
                    <div className="absolute w-4 h-4 bg-[#0277b6] rounded-full -left-2.25 top-0 border-4 border-white shadow-sm"></div>
                    <h5 className="font-bold text-[#0277b6] text-sm mb-1">Step {step.step}</h5>
                    <p className="font-bold text-slate-800 text-lg">{step.title}</p>
                    <p className="text-sm text-slate-500 mt-1">Resource: {step.resource}</p>
                 </div>
              ))}
           </div>

           {/* Section Skill Gap */}
           {activeRole.skill_gap && activeRole.skill_gap.length > 0 && (
             <div className="mb-12 bg-red-50 border border-red-100 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-red-600">
                  <FiAlertCircle size={20} />
                  <h4 className="font-bold text-lg">Skill Gap</h4>
                </div>
                <p className="text-sm text-slate-600 mb-4">Pelajari keahlian berikut untuk memaksimalkan potensi Anda:</p>
                <div className="flex flex-wrap gap-2">
                  {activeRole.skill_gap.map((gap, index) => (
                    <span key={index} className="bg-white border border-red-200 text-red-600 px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm">{gap}</span>
                  ))}
                </div>
             </div>
           )}

           <div className="mb-6"><span className="bg-[#0b1234] text-white px-6 py-2 rounded-xl font-bold text-sm">Rekomendasi Pelatihan</span></div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {activeRole.roadmap.learning_path.map((item, index) => (
                 <div key={index} className="bg-cyan-50 border border-cyan-100 p-5 rounded-2xl flex flex-col justify-between min-h-30 shadow-sm hover:shadow-md transition-shadow">
                    <h6 className="font-bold text-[#0277b6] text-sm leading-snug">{index + 1}. {item.title}</h6>
                    <div className="mt-4 text-center border-t border-cyan-200 pt-3">
                      <span className="text-sm text-slate-500 font-medium">{item.resource}</span>
                    </div>
                 </div>
              ))}
           </div>

           <div className="mb-6"><span className="bg-[#0b1234] text-white px-6 py-2 rounded-xl font-bold text-sm">Proyek yang Bisa Kamu Coba</span></div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              {activeRole.roadmap.dummy_projects.map((project, index) => (
                 <div key={index} className="bg-[#026296] text-white p-6 rounded-2xl shadow-md hover:-translate-y-1 transition-transform">
                    <h6 className="font-bold text-lg mb-2">{index + 1}. {project}</h6>
                    <p className="text-blue-100 text-sm leading-relaxed">Kerjakan proyek ini untuk memperkuat portofolio Anda.</p>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* Bar Bawah */}
      <div className="w-full bg-[#026296] text-white p-4 md:px-8 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
         <div>
            <h4 className="font-bold text-lg">Hasil Analisis</h4>
            <p className="text-xs md:text-sm text-blue-100">Dapatkan hasil analisis melalui email atau unduh langsung.</p>
         </div>
         <button onClick={() => setShowModal(true)} className="bg-white text-slate-800 px-8 py-2 md:py-3 rounded-xl font-bold text-sm hover:bg-slate-100 shadow-sm transition-colors">
           Unduh PDF
         </button>
      </div>

      {/* Modal Email */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
           <div className="bg-[#030b26] p-10 rounded-3xl shadow-2xl w-full max-w-md text-white">
              <div className="flex items-center gap-4 mb-8">
                 <button onClick={() => setShowModal(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                   <FiChevronLeft size={24} />
                 </button>
                 <h3 className="text-2xl font-bold">Data Pengguna</h3>
              </div>
              <input type="email" placeholder="Masukkan Alamat E-mail *" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 rounded-xl mb-8 text-slate-800 font-medium outline-none focus:ring-4 focus:ring-blue-500/50" />
              <button onClick={handleDownload} disabled={!email} className="w-full bg-[#0277b6] hover:bg-[#026296] disabled:opacity-50 px-10 py-4 rounded-xl font-bold text-lg shadow-lg">
                Kirim dan Unduh
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default TesBakatResult;