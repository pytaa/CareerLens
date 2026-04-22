import React from 'react';

function CareerLensHero() {
  const navLinks = [
    { name: 'Beranda', active: true },
    { name: 'Industri', active: false },
    { name: 'Tentang', active: false },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <nav className="w-full px-6 lg:px-12 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-gray-400"></div>
            <span className="text-xl font-bold text-gray-950 tracking-tight">Career<span className="text-accent">Lens</span></span>
          </div>

          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href="#"
                  className={`text-sm font-medium transition-colors ${
                    link.active
                      ? 'text-gray-950 pb-2 border-b-2 border-accent'
                      : 'text-gray-600 hover:text-gray-950'
                  }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 text-gray-600">
            <button className="p-1 hover:text-gray-950">🌐</button>
            <button className="p-1 hover:text-gray-950">☀️</button>
          </div>
        </nav>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="w-full px-6 lg:px-12 pt-16 pb-20 text-center">
        {/* Konten dibatasi max-w-4xl agar teks tidak terlalu panjang, tapi tetap responsif */}
        <div className="max-w-4xl mx-auto">
            
            <div className="inline-flex items-center gap-2 bg-accent-bg text-accent px-4 py-1.5 rounded-full border border-accent-border mb-10 shadow-sm">
                <span className="text-sm font-semibold tracking-tight">Navigasi Karir Masa Depan</span>
            </div>

            <h1 className="text-6xl font-extrabold text-gray-950 leading-tight tracking-tighter mb-8">
                Temukan <span className="text-accent">Lensa Karir Digitalmu.</span>
            </h1>

            <p className="text-xl text-text leading-relaxed mb-16">
                Platform rekomendasi karir untuk 4 sektor industri digital utama: IT, Data Science, Desain, dan Digital Marketing.
            </p>

            <button className="inline-flex items-center gap-3 bg-gray-950 text-white px-7 py-3 rounded-full text-base font-medium shadow-md transition hover:bg-gray-800 mt-4">
                Mulai Analisis Karir →
            </button>
        </div>
      </main>
    </div>
  );
}

export default CareerLensHero;