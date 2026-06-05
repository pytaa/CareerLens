import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import TesBakatResult from './TesBakatResult';
import TesBakatQuiz from './TesBakatQuiz';
import { riasecQuestions } from '../../data/riasecQuestions';
import { FiPlayCircle, FiCheckCircle } from 'react-icons/fi';
import PageHeader from "../../components/PageHeader.jsx"


const TesBakat = () => {
  useEffect(() => {
    document.title = "CareerLens - Tes Bakat";
  });

  // State Navigasi Halaman
  const [view, setView] = useState('intro'); // 'intro', 'quiz', 'result'
  
  // State Quiz
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState(Array(30).fill(null));
  
  // State Hasil API
  const [resultData, setResultData] = useState(null);
  const [payloadScores, setPayloadScores] = useState(null);

  // Fungsi untuk membuat atau mengambil ID
  const getOrCreateUserId = () => {
    let userId = localStorage.getItem('careerlens_user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('careerlens_user_id', userId);
    }
    return userId;
  };

  const handleSelectOption = (val) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = val;
    setAnswers(newAnswers);
  };

  // Mereset seluruh kuis jika user keluar
  const handleCancelQuiz = () => {
    setView('intro');
    setCurrentIdx(0);
    setAnswers(Array(30).fill(null));
  };

  // Fungsi untuk Tes Ulang (Tombol Retake di Halaman Result)
  const handleRetake = () => {
    setView('intro');
    setCurrentIdx(0);
    setAnswers(Array(30).fill(null));
    setResultData(null);
  };

  const handleSubmitQuiz = async () => {
    setView('result'); 

    const rawScores = { r: 0, i: 0, a: 0, s: 0, e: 0, c: 0 };
    answers.forEach((ansValue, idx) => {
      const type = riasecQuestions[idx].type.toLowerCase();
      rawScores[type] += ansValue;
    });

    const scores = {};
    for (let key in rawScores) {
      scores[key] = parseFloat((rawScores[key] / 25).toFixed(2));
    }
    setPayloadScores(scores);

    try {
      const currentUserId = getOrCreateUserId();

      //url temp : http://localhost:5000/api/recommendations

      const response = await fetch(`${import.meta.env.VITE_API_URL}/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUserId, 
          method: "riasec",
          payload: { riasec_scores: scores }
        })
      });

      const jsonResponse = await response.json();

      if (jsonResponse.status === 'success') {
        setResultData(jsonResponse.data);
      } else {
        alert("Gagal menganalisis: " + jsonResponse.message);
        setView('intro');
      }
    } catch (error) {
      console.error("Error API:", error);
      alert("Terjadi kesalahan koneksi.");
      setView('intro');
    }
  };

  // 1. Tampilan Intro
  if (view === 'intro') {
    return (
      <div className="min-h-screen bg-slate-50/50 font-sans flex flex-col">
        <PageHeader />
        <main className="grow flex items-center justify-center p-6 w-full">
           <div className="bg-white w-full max-w-3xl rounded-4xl p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-[#030b26] mb-6">Instruksi Tes RIASEC</h1>
              <p className="text-slate-500 md:text-lg leading-relaxed max-w-xl mb-10">
                Tes RIASEC dirancang untuk membantu Anda mengidentifikasi minat karier profesional melalui enam tipe kepribadian utama yang dikembangkan secara saintifik.
              </p>

              <div className="flex w-full max-w-lg border-y border-slate-100 py-6 mb-10">
                <div className="flex-1 border-r border-slate-100">
                  <h3 className="text-2xl font-bold text-blue-500 mb-1">30 Pertanyaan</h3>
                  <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Jumlah Soal</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-500 mb-1">10-15 Menit</h3>
                  <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Estimasi Waktu</p>
                </div>
              </div>

              <div className="w-full max-w-lg text-left mb-12">
                <p className="text-slate-700 font-medium mb-6">Pahami panduan berikut sebelum memulai:</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <FiCheckCircle className="text-teal-500 mt-1 shrink-0" size={20} />
                    <p className="text-slate-600 text-sm leading-relaxed">Jawablah dengan jujur berdasarkan preferensi pribadi Anda saat ini.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <FiCheckCircle className="text-teal-500 mt-1 shrink-0" size={20} />
                    <p className="text-slate-600 text-sm leading-relaxed">Tidak ada jawaban yang benar atau salah dalam tes minat ini.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <FiCheckCircle className="text-teal-500 mt-1 shrink-0" size={20} />
                    <p className="text-slate-600 text-sm leading-relaxed">Pastikan Anda berada di lingkungan yang tenang untuk fokus maksimal.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setView('quiz')} 
                className="flex items-center gap-3 bg-[#030b26] hover:bg-[#0a194f] text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
              >
                Mulai Tes Sekarang <FiPlayCircle size={22} />
              </button>
           </div>
        </main>
      </div>
    );
  }

  // 2. Tampilan Quiz / Result
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans flex flex-col">
      {view === 'quiz' ? (
        <TesBakatQuiz 
          currentIdx={currentIdx}
          totalQuestions={riasecQuestions.length}
          question={riasecQuestions[currentIdx]}
          currentAnswer={answers[currentIdx]}
          onSelectOption={handleSelectOption}
          onPrev={() => setCurrentIdx(prev => prev - 1)}
          onNext={() => setCurrentIdx(prev => prev + 1)}
          onSubmit={handleSubmitQuiz}
          onCancel={handleCancelQuiz}
        />
      ) : (
        <TesBakatResult 
          resultData={resultData}
          payloadScores={payloadScores}
          onBack={handleRetake}        
          onRetake={handleRetake}      
        />
      )}
    </div>
  );
};

export default TesBakat;