import React, { useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { BiBrain } from 'react-icons/bi';
import { BsQuestionSquareFill } from 'react-icons/bs';

const TesBakatQuiz = ({ 
  currentIdx, 
  totalQuestions, 
  question, 
  currentAnswer, 
  onSelectOption, 
  onPrev, 
  onNext, 
  onSubmit, 
  onCancel 
}) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false); // State untuk modal peringatan keluar

  const isFirstQuestion = currentIdx === 0;
  const isLastQuestion = currentIdx === totalQuestions - 1;
  
  // PERBAIKAN PROGRESS BAR: Menghitung jumlah soal yang benar-benar sudah dijawab
  const answeredCount = currentAnswer !== null ? currentIdx + 1 : currentIdx;
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

  const likertOptions = [
    { label: "Sangat Tidak Setuju", value: 1 },
    { label: "Tidak Setuju", value: 2 },
    { label: "Netral", value: 3 },
    { label: "Setuju", value: 4 },
    { label: "Sangat Setuju", value: 5 }
  ];

  const handleFinish = () => {
    setShowSubmitModal(false);
    onSubmit();
  };

  // Fungsi untuk menangani klik tombol "Kembali"
  const handleCancelClick = () => {
    // Jika user sudah di halaman > 0 ATAU sudah mengisi jawaban di halaman pertama
    if (currentIdx > 0 || currentAnswer !== null) {
      setShowExitModal(true);
    } else {
      // Jika belum ngapa-ngapain, langsung keluar tanpa peringatan
      onCancel();
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      
      {/* Header Minimalis */}
      <header className="w-full px-6 md:px-10 py-5 flex items-center relative bg-white/50 border-b border-slate-200/60 z-10 backdrop-blur-sm">
        {/* Tombol kembali sekarang memanggil handleCancelClick */}
        <button onClick={handleCancelClick} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
          <FiArrowLeft size={20} /> Kembali
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 font-extrabold text-xl text-blue-950 tracking-tight">
          CareerLens
        </div>
      </header>

      {/* Main Container Quiz */}
      <div className="grow flex flex-col items-center px-6 py-8 md:py-12 w-full max-w-5xl mx-auto">
        
        {/* Progress Bar Section */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-blue-600 tracking-wider">
              PERTANYAAN {currentIdx + 1}/{totalQuestions}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {progressPercentage}% Selesai
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#0277b6] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Card Pertanyaan Utama */}
        <div className="bg-white w-full rounded-3xl p-8 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center">
          
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8">
            <BiBrain size={32} />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 leading-snug mb-12 max-w-2xl">
            {question.text}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full mb-12">
            {likertOptions.map((opt) => {
              const isSelected = currentAnswer === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onSelectOption(opt.value)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full mb-4 flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-blue-600' : 'border-2 border-slate-300'
                  }`}>
                    {isSelected && <div className="w-3 h-3 bg-white rounded-full"></div>}
                  </div>
                  <span className={`text-sm font-bold text-center ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center w-full mt-auto pt-6 border-t border-slate-100">
             <button 
               onClick={onPrev}
               disabled={isFirstQuestion}
               className="flex items-center gap-2 border border-blue-300 text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 disabled:opacity-0 transition-all"
             >
               <FiArrowLeft size={18} /> Sebelumnya
             </button>
             
             {isLastQuestion ? (
               <button 
                 onClick={() => setShowSubmitModal(true)}
                 disabled={currentAnswer === null}
                 className="flex items-center gap-2 bg-[#1e3a8a] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
               >
                 Selesai
               </button>
             ) : (
               <button 
                 onClick={onNext}
                 disabled={currentAnswer === null}
                 className="flex items-center gap-2 bg-[#1e3a8a] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
               >
                 Selanjutnya <FiArrowRight size={18} />
               </button>
             )}
          </div>

        </div>
      </div>

      {/* Modal Konfirmasi Submit (Selesai) */}
      {showSubmitModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-50 px-4">
           <div className="bg-white p-10 rounded-4xl shadow-2xl max-w-md w-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-6">
                 <BsQuestionSquareFill size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Kirim Jawaban?</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Apakah Anda yakin untuk mengirimkan jawaban? Anda tidak dapat mengubah jawaban setelah proses ini selesai.
              </p>
              <div className="flex w-full gap-4">
                 <button onClick={() => setShowSubmitModal(false)} className="flex-1 border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors">
                   Tidak, Kembali
                 </button>
                 <button onClick={handleFinish} className="flex-1 bg-[#0277b6] hover:bg-[#025c8d] text-white py-3 rounded-xl font-bold shadow-md transition-colors">
                   Ya
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Modal Peringatan Keluar (Batal) */}
      {showExitModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-50 px-4">
           <div className="bg-white p-10 rounded-4xl shadow-2xl max-w-md w-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                 <FiAlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Keluar dari Tes?</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Jawaban Anda tidak akan disimpan dan akan dihapus permanen jika Anda keluar sekarang. Yakin ingin membatalkan tes?
              </p>
              <div className="flex w-full gap-4">
                 <button onClick={() => setShowExitModal(false)} className="flex-1 border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors">
                   Lanjut Tes
                 </button>
                 <button onClick={onCancel} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow-md transition-colors">
                   Ya, Keluar
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default TesBakatQuiz;