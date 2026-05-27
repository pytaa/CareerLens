import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../../assets/careerLens_logo_1.png';

const Navbar = () => {
  const navigate = useNavigate();
  
  // State untuk melacak menu mana yang sedang aktif
  const [activeSection, setActiveSection] = useState('beranda');

  useEffect(() => {
    // Fungsi untuk mendeteksi posisi scroll
    const handleScroll = () => {
      // Daftar ID section yang ada di halaman utama kamu
      const sections = ['beranda', 'industri', 'tentang'];
      
      // tambahkan sedikit jarak (offset) sekitar 100px untuk mengkompensasi tinggi navbar
      const scrollPosition = window.scrollY + 100; 

      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section);
        if (element) {
          // Jika posisi scroll sudah melewati bagian atas elemen tersebut
          if (scrollPosition >= element.offsetTop) {
            setActiveSection(section);
            break; // Hentikan perulangan jika sudah menemukan yang cocok
          }
        }
      }
    };

    // Tambahkan "telinga" pendengar event scroll
    window.addEventListener('scroll', handleScroll);
    
    // Panggil sekali di awal untuk mengecek posisi saat pertama kali load
    handleScroll();

    // Bersihkan "telinga" saat komponen dihancurkan agar memori tidak bocor
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fungsi helper untuk merender gaya CSS berdasarkan menu yang sedang aktif
  const getNavStyle = (sectionId) => {
    return activeSection === sectionId
      ? "text-[#030B26] font-bold border-b-2 border-[#0277B6] pb-1 transition-all"
      : "text-slate-600 hover:text-[#030B26] font-medium border-b-2 border-transparent pb-1 transition-all";
  };

  return (
    <nav className="w-full px-6 md:px-16 py-4 flex items-center justify-between bg-white/90 backdrop-blur-sm fixed top-0 z-50 border-b border-slate-100">
      
      {/* KIRI: Logo */}
      <div className="flex items-center cursor-pointer w-auto" onClick={() => navigate('/')}>
        <img 
          src={logoIcon} 
          alt="CareerLens Logo" 
          className="h-10 w-auto object-contain" 
        />
      </div>

      {/* TENGAH: Menu Navigasi dengan Style Dinamis */}
      <div className="hidden md:flex items-center gap-10">
        <a 
          href="#beranda" 
          onClick={() => setActiveSection('beranda')}
          className={getNavStyle('beranda')}
        >
          Beranda
        </a>
        <a 
          href="#industri" 
          onClick={() => setActiveSection('industri')}
          className={getNavStyle('industri')}
        >
          Industri
        </a>
        <a 
          href="#tentang" 
          onClick={() => setActiveSection('tentang')}
          className={getNavStyle('tentang')}
        >
          Tentang
        </a>
      </div>

      {/* KANAN: Spacer Kosong Penyeimbang */}
      <div className="hidden md:block w-32"></div>

    </nav>
  );
};

export default Navbar;