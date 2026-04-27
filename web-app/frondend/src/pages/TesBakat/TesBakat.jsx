import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import TesBakatResult from './TesBakatResult';
import TesBakatQuiz from './TesBakatQuiz'; 
import { riasecQuestions } from '../../data/riasecQuestions';
import { FiArrowLeft } from 'react-icons/fi';

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

  // Fungsi untuk menyimpan pilihan jawaban
  const handleSelectOption = (val) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = val;
    setAnswers(newAnswers);
  };

  // Fungsi Kalkulasi dan Fetch API
  const handleSubmitQuiz = async () => {
    setView('result'); // Pindah ke halaman hasil (akan menampilkan loading)

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

  // --- 1. RENDER LAYAR INTRO ---
  if (view === 'intro') {
    return (
      <div className="min-h-screen bg-slate-400 font-sans flex flex-col relative">
        <Navbar />
        <div className="grow flex items-center justify-center p-6 mt-8">
           <div className="w-full max-w-6xl">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-white text-slate-800 px-6 py-2 rounded-full font-medium shadow-md hover:bg-slate-100 mb-6 w-max">
                <FiArrowLeft size={20} /> Kembali
              </button>
              
              <div className="bg-slate-50 w-full rounded-4xl p-16 shadow-2xl flex flex-col items-center relative overflow-hidden">
                 <h1 className="text-5xl font-bold text-slate-300 mb-16 text-center">Metode Analisis</h1>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl opacity-50 blur-sm pointer-events-none">
                    <div className="bg-cyan-200 h-64 rounded-3xl"></div>
                    <div className="bg-cyan-200 h-64 rounded-3xl"></div>
                    <div className="bg-cyan-200 h-64 rounded-3xl"></div>
                 </div>

                 {/* Modal Mulai Tes */}
                 <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-[#030b26] p-10 rounded-2xl shadow-2xl max-w-md w-full text-white text-center">
                       <p className="text-lg leading-relaxed mb-6">
                         Mohon jawab seluruh pertanyaan dengan jujur sesuai dengan kepribadian dan preferensi Anda. Tidak ada jawaban benar atau salah.<br/><br/>
                         Apakah Anda sudah siap untuk memulai tes?
                       </p>
                       <div className="flex justify-center gap-4">
                          <button onClick={() => navigate(-1)} className="bg-cyan-100 text-slate-800 px-6 py-2 rounded-xl font-bold">Tidak, Kembali</button>
                          <button onClick={() => setView('quiz')} className="bg-[#0277b6] hover:bg-[#026296] text-white px-8 py-2 rounded-xl font-bold">Ya</button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- 2. RENDER LAYAR KUIS & 3. LAYAR HASIL ---
  return (
    <div className="min-h-screen bg-[#030b26] font-sans flex flex-col relative">
      <Navbar />
      
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
          onCancel={() => navigate(-1)}
        />
      ) : (
        <TesBakatResult data={resultData} interestCode={interestCode} />
      )}

    </div>
  );
};

export default TesBakat;