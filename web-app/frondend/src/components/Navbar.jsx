import { Link } from 'react-scroll';
import { FiGlobe, FiMoon } from 'react-icons/fi';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-50/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex items-center gap-2">
          {/* Placeholder untuk Logo CareerLens */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">C</div>
          <span className="text-xl font-bold text-blue-900 tracking-tight">CareerLens</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-8 font-semibold text-slate-700">
          <Link to="beranda" smooth={true} duration={500} className="cursor-pointer hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all">Beranda</Link>
          <Link to="industri" smooth={true} duration={500} offset={-80} className="cursor-pointer hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all">Industri</Link>
          <Link to="tentang" smooth={true} duration={500} offset={-80} className="cursor-pointer hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all">Tentang</Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 bg-blue-100 text-blue-900 rounded-full hover:bg-blue-200 transition">
            <FiGlobe size={20} />
          </button>
          <button className="p-2 bg-blue-100 text-blue-900 rounded-full hover:bg-blue-200 transition">
            <FiMoon size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;