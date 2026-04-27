import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

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

  const isFirstQuestion = currentIdx === 0;
  const isLastQuestion = currentIdx === totalQuestions - 1;

  const likertOptions = [
    { label: "Sangat Tidak Setuju", value: 1 },
    { label: "Tidak Setuju", value: 2 },
    { label: "Netral", value: 3 },
    { label: "Setuju", value: 4 },
    { label: "Sangat Setuju", value: 5 }
  ];

  const handleFinish = () => {
    setShowSubmitModal(false);
    onSubmit(); // Panggil fungsi fetch API di komponen induk
  };

  return (
    <div className="grow flex items-center justify-center p-6 mt-8 w-full">
      <div className="w-full max-w-3xl">
        
        {/* Tombol Kembali */}
        <button 
          onClick={onCancel} 
          className="flex items-center gap-2 bg-white text-slate-800 px-6 py-2 rounded-full font-medium shadow-md hover:bg-slate-100 mb-6 w-max"
        >
          <FiArrowLeft size={20} /> Kembali
        </button>
        
        {/* Container Utama Quiz */}
        <div className="bg-slate-50 w-full rounded-4xl p-8 md:p-12 shadow-2xl relative">
           <h1 className="text-4xl font-bold text-[#030b26] text-center mb-2">Tes Minat Bakat</h1>
           <p className="text-right text-slate-500 font-medium mb-4">Pertanyaan {currentIdx + 1}/{totalQuestions}</p>
           
           <div className="bg-[#030b26] rounded-3xl p-8 md:p-10 text-white min-h-100 flex flex-col">
              <h2 className="text-2xl font-bold mb-8 text-center leading-relaxed">
                {question.text}
              </h2>

              {/* Tombol Pilihan Jawaban */}
              <div className="flex flex-col gap-3 mb-8 w-full max-w-md mx-auto grow">
                 {likertOptions.map(opt => (
                   <button
                     key={opt.value}
                     onClick={() => onSelectOption(opt.value)}
                     className={`w-full py-3 px-6 rounded-2xl border-2 font-bold transition-all text-lg ${
                       currentAnswer === opt.value 
                         ? 'bg-cyan-500 border-cyan-300 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                         : 'bg-[#0277b6] border-transparent text-white hover:bg-[#026296]'
                     }`}
                   >
                     {opt.label}
                   </button>
                 ))}
              </div>

              {/* Navigasi Bawah */}
              <div className="flex justify-between items-center w-full">
                 <button 
                   onClick={onPrev}
                   disabled={isFirstQuestion}
                   className="bg-cyan-100 text-slate-800 px-6 py-2 rounded-full font-bold disabled:opacity-50"
                 >
                   Sebelumnya
                 </button>
                 
                 {isLastQuestion ? (
                   <button 
                     onClick={() => setShowSubmitModal(true)}
                     disabled={currentAnswer === null}
                     className="bg-cyan-100 text-slate-800 px-6 py-2 rounded-full font-bold disabled:opacity-50"
                   >
                     Selesai
                   </button>
                 ) : (
                   <button 
                     onClick={onNext}
                     disabled={currentAnswer === null}
                     className="bg-cyan-100 text-slate-800 px-6 py-2 rounded-full font-bold disabled:opacity-50"
                   >
                     Selanjutnya
                   </button>
                 )}
              </div>
           </div>

           {/* Modal Submit */}
           {showSubmitModal && (
             <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-md rounded-4xl z-50">
                <div className="bg-[#030b26] p-10 rounded-2xl shadow-2xl max-w-md w-full text-white text-center">
                   <p className="text-lg leading-relaxed mb-8">Apakah Anda yakin untuk mengirimkan jawaban?</p>
                   <div className="flex justify-center gap-4">
                      <button onClick={() => setShowSubmitModal(false)} className="bg-cyan-100 text-slate-800 px-6 py-2 rounded-xl font-bold">Tidak, Kembali</button>
                      <button onClick={handleFinish} className="bg-[#0277b6] hover:bg-[#026296] text-white px-8 py-2 rounded-xl font-bold">Ya</button>
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default TesBakatQuiz;