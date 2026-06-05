import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage/LandingPage.jsx';
import MetodeAnalisis from './pages/MetodeAnalisis/MetodeAnalisis.jsx';
import MinatKarir from './pages/MinatKarir/MinatKarir.jsx';
import AnalisisSkill from './pages/AnalisisSkill/AnalisisSkill.jsx';
import TesBakat from './pages/TesBakat/TesBakat.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* jalur setelah user tekan tombol "mulai analisis" */}
        <Route path="/metode" element={<MetodeAnalisis />} />
       
       {/* jalur buat minat karir */}
       <Route path="/minat-karir" element={<MinatKarir />} />

       {/* jalur buat analisis skill */}
       <Route path="/analisis-skill" element={<AnalisisSkill />} />

       {/* jalur buat tes minat */}
       <Route path="/tes-bakat" element={<TesBakat />} />
      </Routes>
    </Router>
  );
}

export default App;