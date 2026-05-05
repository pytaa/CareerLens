import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TesBakatResult from './TesBakatResult';
import TesBakatQuiz from './TesBakatQuiz';
import { riasecQuestions } from '../../data/riasecQuestions';
import { FiArrowLeft, FiPlayCircle, FiCheckCircle } from 'react-icons/fi';

const TesBakat = () => {
  const navigate = useNavigate();
  
  // State Navigasi Halaman
  const [view, setView] = useState('intro'); // 'intro', 'quiz', 'result'
  
  // State Quiz
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState(Array(30).fill(null));
  
  // State Hasil API
  const [resultData, setResultData] = useState(null);
  const [interestCode, setInterestCode] = useState([]);

  const handleSelectOption = (val) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = val;
    setAnswers(newAnswers);
  };

  // mereset seluruh kuis jika user keluar
  const handleCancelQuiz = () => {
    setView('intro'); // Kembalikan ke halaman awal
    setCurrentIdx(0); // Reset ke soal nomor 1
    setAnswers(Array(30).fill(null)); // Kosongkan seluruh jawaban
  };

  const handleSubmitQuiz = async () => {
    setView('result'); 

    const rawScores = { r: 0, i: 0, a: 0, s: 0, e: 0, c: 0 };
    answers.forEach((ansValue, idx) => {
      const type = riasecQuestions[idx].type.toLowerCase();
      rawScores[type] += ansValue;
    });

    const payloadScores = {};
    for (let key in rawScores) {
      payloadScores[key] = parseFloat((rawScores[key] / 25).toFixed(2));
    }

    const sortedTypes = Object.entries(payloadScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0].toUpperCase());
    
    setInterestCode(sortedTypes);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: "user_anonim_123",
          method: "riasec",
          payload: { riasec_scores: payloadScores }
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

  // intro
  if (view === 'intro') {
    return (
      <div className="min-h-screen bg-slate-50/50 font-sans flex flex-col">
        
        {/* Header Minimalis */}
        <header className="w-full px-6 md:px-10 py-5 flex items-center relative bg-white/50 border-b border-slate-200/60 z-10 backdrop-blur-sm">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors">
            <FiArrowLeft size={20} /> Kembali
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 font-extrabold text-xl text-blue-950 tracking-tight">
            CareerLens
          </div>
        </header>

        <main className="grow flex items-center justify-center p-6 w-full">
           <div className="bg-white w-full max-w-3xl rounded-4xl p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center">
              
              <h1 className="text-3xl md:text-4xl font-bold text-[#030b26] mb-6">
                Instruksi Tes RIASEC
              </h1>
              
              <p className="text-slate-500 md:text-lg leading-relaxed max-w-xl mb-10">
                Tes RIASEC dirancang untuk membantu Anda mengidentifikasi minat karier profesional melalui enam tipe kepribadian utama yang dikembangkan secara saintifik.
              </p>

              {/* Info Box (Soal & Waktu) */}
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

              {/* List Panduan */}
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

              {/* Tombol Mulai */}
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

  // render hasil atau quiz
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
        <TesBakatResult data={resultData} interestCode={interestCode} />
      )}
    </div>
  );
};

export default TesBakat;