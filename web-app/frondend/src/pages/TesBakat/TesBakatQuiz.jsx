import React, { useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
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
  const [showExitModal, setShowExitModal] = useState(false);

  const isFirstQuestion = currentIdx === 0;
  const isLastQuestion = currentIdx === totalQuestions - 1;
  
  const answeredCount = currentAnswer !== null ? currentIdx + 1 : currentIdx;
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

const likertOptions = [
    { label: "Sangat Setuju", value: 5 },
    { label: "Setuju", value: 4 },
    { label: "Netral", value: 3 },
    { label: "Tidak Setuju", value: 2 },
    { label: "Sangat Tidak Setuju", value: 1 }
  ];

  const handleFinish = () => {
    setShowSubmitModal(false);
    onSubmit();
  };

  const handleCancelClick = () => {
    if (currentIdx > 0 || currentAnswer !== null) {
      setShowExitModal(true);
    } else {
      onCancel();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 w-full">
      
      {/* Header Minimalis */}
      <header className="w-full px-6 md:px-12 py-5 flex items-center relative bg-white border-b border-slate-100 shrink-0 z-10">
        <button onClick={handleCancelClick} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors z-10">
          <FiArrowLeft size={20} /> Kembali
        </button>
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 font-extrabold text-xl text-blue-950 tracking-tight">
          CareerLens
        </div>
      </header>

      {/* Main Container Quiz */}
      <main className="grow flex flex-col items-center px-4 md:px-6 py-8 md:py-12 w-full max-w-5xl mx-auto">
        
        {/* Progress Bar Section */}
        <div className="w-full mb-8 px-2">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] md:text-xs font-bold text-blue-600 tracking-wider">
              PERTANYAAN {currentIdx + 1}/{totalQuestions}
            </span>
            <span className="text-[10px] md:text-xs font-bold text-slate-500">
              {progressPercentage}% Selesai
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#030B26] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Card Pertanyaan Utama */}
        {/* Padding atas disesuaikan sedikit (pt-10 md:pt-16) agar estetika tetap terjaga setelah ikon dihapus */}
        <div className="bg-white w-full rounded-4xl p-6 pt-10 md:p-14 md:pt-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center">
          
          {/* BAGIAN IKON SUDAH DIHAPUS DISINI */}

          <h2 className="text-xl md:text-3xl font-bold text-center text-slate-900 leading-relaxed mb-8 md:mb-12 max-w-3xl w-full">
            {question.text}
          </h2>

          {/* Grid Opsi Jawaban (Tetap Responsif 1 Kolom di HP, 5 di PC) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 w-full mb-8 md:mb-12">
            {likertOptions.map((opt) => {
              const isSelected = currentAnswer === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onSelectOption(opt.value)}
                  className={`flex flex-row md:flex-col items-center justify-start md:justify-center p-4 md:p-6 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                      : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full mr-4 md:mr-0 md:mb-4 flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-blue-600' : 'border-2 border-slate-300'
                  }`}>
                    {isSelected && <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>}
                  </div>
                  <span className={`text-sm font-bold text-left md:text-center ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigasi Bawah */}
          <div className="flex flex-row justify-between items-center w-full mt-auto pt-6 border-t border-slate-100 gap-4">
             <button 
               onClick={onPrev}
               disabled={isFirstQuestion}
               className="flex items-center justify-center gap-2 border border-slate-300 text-slate-600 px-4 md:px-6 py-3 rounded-xl font-bold hover:bg-slate-50 hover:text-blue-600 disabled:opacity-0 transition-all min-w-12.5"
             >
               <FiArrowLeft size={20} /> <span className="hidden md:inline">Sebelumnya</span>
             </button>
             
             {isLastQuestion ? (
               <button 
                 onClick={() => setShowSubmitModal(true)}
                 disabled={currentAnswer === null}
                 className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#030B26] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
               >
                 Selesai
               </button>
             ) : (
               <button 
                 onClick={onNext}
                 disabled={currentAnswer === null}
                 className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#030B26] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
               >
                 Selanjutnya <FiArrowRight size={20} className="hidden md:block" />
               </button>
             )}
          </div>

        </div>
      </main>

      {/* Modal Konfirmasi Submit */}
      {showSubmitModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 px-4">
           <div className="bg-white p-8 md:p-10 rounded-4xl shadow-2xl max-w-md w-full flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                 <BsQuestionSquareFill size={28} />
              </div>
              <h3 className="text-2xl font-bold text-[#030B26] mb-3">Kirim Jawaban?</h3>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8">
                Apakah Anda yakin untuk mengirimkan jawaban? Anda tidak dapat mengubah jawaban setelah proses ini selesai.
              </p>
              <div className="flex flex-col-reverse md:flex-row w-full gap-3 md:gap-4">
                 <button onClick={() => setShowSubmitModal(false)} className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 py-3 rounded-xl font-bold transition-colors">
                   Tidak, Kembali
                 </button>
                 <button onClick={handleFinish} className="flex-1 bg-[#030B26] hover:bg-blue-900 text-white py-3 rounded-xl font-bold shadow-md transition-colors">
                   Ya, Kirim
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Modal Peringatan Keluar */}
      {showExitModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 px-4">
           <div className="bg-white p-8 md:p-10 rounded-4xl shadow-2xl max-w-md w-full flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                 <FiAlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#030B26] mb-3">Keluar dari Tes?</h3>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8">
                Jawaban Anda tidak akan disimpan dan akan dihapus permanen jika Anda keluar sekarang. Yakin ingin membatalkan tes?
              </p>
              <div className="flex flex-col-reverse md:flex-row w-full gap-3 md:gap-4">
                 <button onClick={() => setShowExitModal(false)} className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 py-3 rounded-xl font-bold transition-colors">
                   Lanjut Tes
                 </button>
                 <button onClick={onCancel} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold shadow-md transition-colors">
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