import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage/LandingPage.jsx';
import MetodeAnalisis from './pages/MetodeAnalisis/MetodeAnalisis.jsx';
import MinatKarir from './pages/MinatKarir/MinatKarir.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* jalur setelah user tekan tombol "mulai analisis" */}
        <Route path="/metode" element={<MetodeAnalisis />} />
       
       {/* jalur buat minat karir */}
       <Route path="/minat-karir" element={<MinatKarir />} />
      </Routes>
    </Router>
  );
}

export default App;