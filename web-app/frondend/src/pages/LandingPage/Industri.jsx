import React from 'react';
import { FaCode, FaPalette, FaDatabase, FaChartLine } from 'react-icons/fa';

import imgIT from '../../../../assets/TI_dan_software.png';
import imgDesign from '../../../../assets/desainKreatif_dan_UIUX.png';
import imgData from '../../../../assets/dataScience_dan_AI.png';
import imgMarketing from '../../../../assets/digitalMarketing_dan_analis.png';

const industries = [
  {
    id: 1,
    title: 'Teknologi Informasi & Software Development',
    desc: 'Teknologi Informasi (IT) & Software Development adalah bidang yang berfokus pada pembangunan, pengelolaan, dan pemeliharaan sistem serta aplikasi digital, mulai dari website, aplikasi mobile, hingga infrastruktur server dan cloud.',
    icon: <FaCode size={24} />,
    img: imgIT 
  },
  {
    id: 2,
    title: 'Desain Kreatif & UI/UX',
    desc: 'Desain Kreatif & UI/UX berfokus pada perancangan tampilan dan pengalaman pengguna agar produk digital tidak hanya menarik secara visual, tetapi juga mudah dan nyaman digunakan.',
    icon: <FaPalette size={24} />,
    img: imgDesign
  },
  {
    id: 3,
    title: 'Data Science & Artificial Intelligence',
    desc: 'Data Science & Artificial Intelligence merupakan bidang yang mengolah data menjadi informasi bernilai serta mengembangkan sistem cerdas yang mampu belajar dan mengambil keputusan.',
    icon: <FaDatabase size={24} />,
    img: imgData
  },
  {
    id: 4,
    title: 'Digital Marketing & Analytics',
    desc: 'Digital Marketing & Analytics adalah bidang yang berperan dalam mempromosikan produk atau layanan melalui platform digital serta menganalisis performa strategi pemasaran yang digunakan.',
    icon: <FaChartLine size={24} />,
    img: imgMarketing
  }
];

export default function Industri(){
   return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-blue-950 mb-4">Sektor <span className="text-blue-600">Industri.</span></h2>
        <p className="text-slate-600 text-lg max-w-3xl">
          CareerLens memberikan rekomendasi karir untuk 4 sektor industri digital utama, yaitu IT, Data Science, Desain, dan Digital Marketing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {industries.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row bg-blue-950 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="sm:w-2/5 h-48 sm:h-auto">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="sm:w-3/5 p-6 text-white space-y-3">
              <div className="flex items-center gap-3 font-semibold text-lg">
                <div className="p-2 bg-blue-900 rounded-lg">{item.icon}</div>
                <h3>{item.title}</h3>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed text-justify">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}