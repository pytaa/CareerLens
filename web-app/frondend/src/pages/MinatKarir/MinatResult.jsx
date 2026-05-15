import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';

const MinatResult = ({ data }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [sendingReport, setSendingReport] = useState(false);

  // 1. Inisialisasi state dengan null
  const [activeRole, setActiveRole] = useState(null);

  // 2. Gunakan useEffect untuk memantau perubahan pada 'data'
  useEffect(() => {
    // Ketika data dari API sudah berhasil ditangkap, atur role pertama sebagai yang aktif
    if (data && data.recommendations && data.recommendations.length > 0) {
      setActiveRole(data.recommendations[0]);
    }
  }, [data]); // Array dependency [data] memastikan ini dipanggil setiap kali data berubah

  // 3. Tampilkan loading jika data belum ada ATAU activeRole belum di-set
  if (!data || !activeRole) {
    return (
      <div className="grow flex items-center justify-center text-slate-800 text-2xl font-bold bg-white w-full h-full min-h-125">
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
    <div className="grow flex flex-col w-full bg-white relative">
      
      {/* Container Utama (Full Width tanpa padding samping luar) */}
      <div className="flex flex-col md:flex-row w-full grow border-t border-slate-200">
        
        {/* Sidebar Kiri */}
        <div className="w-full md:w-1/4 bg-slate-50 border-r border-slate-200 p-6 md:p-8 flex flex-col">
          <h2 className="font-bold text-lg text-slate-800 mb-1">Bidang Sektor Industri</h2>
          <p className="text-[#0277b6] font-bold text-lg mb-8">Data Science & Artificial Intelligence</p>
          
          <h3 className="font-bold text-slate-800 text-lg mb-4">Rekomendasi Sektor Industri</h3>
          
          <div className="space-y-4 grow">
            {data.recommendations.map((role) => (
              <button 
                key={role.role_id}
                onClick={() => setActiveRole(role)} // Action untuk mengganti data di kanan
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
             <div className="bg-cyan-100 p-4 rounded-xl mb-6 shadow-sm">
                <p className="text-sm text-slate-700 italic font-medium">
                  "Berdasarkan analisis model kami, Anda memiliki fondasi teknis yang kuat dengan bakat analitis yang menonjol."
                </p>
             </div>
             <div className="flex justify-center">
               <button 
                 onClick={() => navigate(0)} 
                 className="bg-[#0b1234] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-900 shadow-md transition-all w-full"
               >
                 Mulai Analisis Baru
               </button>
             </div>
          </div>
        </div>

        {/* Konten Kanan (Detail Role Berubah Dinamis) */}
        <div className="w-full md:w-3/4 p-8 md:p-12 overflow-y-auto bg-white transition-all duration-500">
           <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 text-center md:text-left">
             {activeRole.role_name}
           </h1>

           {/* Deskripsi & Penghasilan */}
           <div className="flex flex-col md:flex-row gap-8 mb-10 border-b border-slate-200 pb-8">
              <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-800 mb-2">Deskripsi Peran :</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{activeRole.description}</p>
              </div>
              <div className="flex-1 md:border-l border-slate-200 md:pl-8">
                <h4 className="font-bold text-sm text-slate-800 mb-2">Penghasilan:</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Seorang {activeRole.role_name.toLowerCase()} memiliki rata-rata penghasilan sekitar {activeRole.salary_range} menurut industri di Indonesia.
                </p>
              </div>
           </div>

           {/* Bagian Roadmap */}
           <div className="mb-6">
              <span className="bg-[#0b1234] text-white px-6 py-2 rounded-xl font-bold text-sm">
                Rekomendasi Road Map
              </span>
           </div>
           
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

           {/* Bagian Rekomendasi Pelatihan */}
           <div className="mb-6">
              <span className="bg-[#0b1234] text-white px-6 py-2 rounded-xl font-bold text-sm">
                Rekomendasi Pelatihan
              </span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {activeRole.roadmap.learning_path.map((item, index) => (
                 <div key={index} className="bg-cyan-50 border border-cyan-100 p-5 rounded-2xl flex flex-col justify-between min-h-30 shadow-sm hover:shadow-md transition-shadow">
                    <h6 className="font-bold text-[#0277b6] text-sm leading-snug">
                      {index + 1}. {item.title}
                    </h6>
                    <div className="mt-4 text-center border-t border-cyan-200 pt-3">
                      <span className="text-sm text-slate-500 font-medium">{item.resource}</span>
                    </div>
                 </div>
              ))}
           </div>

           {/* Bagian Dummy Projects */}
           <div className="mb-6">
              <span className="bg-[#0b1234] text-white px-6 py-2 rounded-xl font-bold text-sm">
                Proyek yang Bisa Kamu Coba
              </span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              {activeRole.roadmap.dummy_projects.map((project, index) => (
                 <div key={index} className="bg-[#026296] text-white p-6 rounded-2xl shadow-md hover:-translate-y-1 transition-transform">
                    <h6 className="font-bold text-lg mb-2">
                      {index + 1}. {project}
                    </h6>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      Kerjakan proyek simulasi ini untuk memperkuat portofolio dan pemahaman praktikal Anda.
                    </p>
                 </div>
              ))}
           </div>
        </div>
      </div>

      {/* Baris Bawah & Tombol Unduh PDF */}
      <div className="w-full bg-[#026296] text-white p-4 md:px-8 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
         <div>
            <h4 className="font-bold text-lg">Hasil Analisis</h4>
            <p className="text-xs md:text-sm text-blue-100">Dapatkan hasil analisis melalui email atau unduh langsung.</p>
         </div>
         <button 
           onClick={() => setShowModal(true)}
           className="bg-white text-slate-800 px-8 py-2 md:py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors shadow-sm"
         >
           Unduh PDF
         </button>
      </div>

      {/* Modal Popup Email */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
           <div className="bg-[#030b26] p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md text-white relative">
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
                className="w-full p-4 rounded-xl mb-8 text-slate-800 font-medium outline-none focus:ring-4 focus:ring-blue-500/50 transition-all placeholder:text-slate-400"
              />
              <div className="flex justify-center">
                <button 
                  onClick={handleDownload}
                  disabled={!email || sendingReport}
                  className="bg-[#0277b6] hover:bg-[#026296] disabled:opacity-50 disabled:cursor-not-allowed px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
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