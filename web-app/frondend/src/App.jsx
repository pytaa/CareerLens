import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage/LandingPage.jsx';
import MetodeAnalisis from './pages/MetodeAnalisis/MetodeAnalisis.jsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* jalur setelah user tekan tombol "mulai analisis" */}
        <Route path="/metode" element={<MetodeAnalisis />} />
       
      </Routes>
    </Router>
  );
}

export default App;