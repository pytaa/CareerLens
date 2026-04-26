import React from "react";

import careerLensLogo from '../../../../assets/careerLens_logo_2.png';

export default function About() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 mb-12 border-t border-slate-200 mt-8">
      <h2 className="text-4xl font-bold text-blue-950 mb-8">
        Tentang <span className="text-blue-500">CareerLens.</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"> 
        <div className="bg-cyan-100 p-8 md:p-12  rounded-4xl shadow-sm">
          <p className="text-xl md:text-2xl font-medium text-slate-800 italic leading-relaxed">
            "CareerLens merupakan sebuah platform berbasis website yang
            bertujuan untuk membantu para pencari kerja dalam menentukan skill
            mereka untuk mencari pekerjaan, untuk itu CareerLens membaginya ke
            dalam 4 sektor utama industri yaitu Teknologi Informasi & Software
            Development, Data Science & Intelligence, Desain Kreatif & UI/UX,
            serta Digital Marketing & Analytics"
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <img
            src={careerLensLogo}
            alt="CareerLens Official Logo"
            className="w-96 h-auto"
          />
        </div>
      </div>
    </section>
  );
}
