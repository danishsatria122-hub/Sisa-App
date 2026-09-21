'use client';

import { useState } from 'react';

/* ── SVG ICONS (Preserved original shapes with vibrant brand colors) ── */

function PETBottle({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 80 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Bottle Cap in Smile Yellow */}
      <rect x="29" y="10" width="22" height="12" rx="3" fill="#FAEF8A" stroke="#4CAF50" strokeWidth="2" />
      <line x1="33" y1="14" x2="47" y2="14" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
      
      {/* Bottle Neck */}
      <path d="M33 22 L27 38 L53 38 L47 22" fill="#E8F8EA" stroke="#4CAF50" strokeWidth="2" strokeLinejoin="round" />
      
      {/* Main Bottle Body with Soft Green Fill */}
      <path
        d="M21 38 Q17 62 19 90 Q17 118 23 134 Q40 140 57 134 Q63 118 61 90 Q63 62 59 38 Z"
        fill={active ? '#E3F8E6' : '#F0FAF1'}
        stroke="#4CAF50"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      
      {/* Brand Yellow Label Strip */}
      <rect x="20" y="68" width="40" height="24" rx="3" fill="#FAEF8A" stroke="#FBBF24" strokeWidth="1" />
      <path d="M26 80 Q40 86 54 80" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
      
      {/* Shimmer / Recycle Details */}
      <ellipse cx="27" cy="50" rx="2" ry="5" fill="#68E36D" opacity="0.8" />
      <path d="M22 108 Q40 114 58 108" stroke="#4CAF50" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function Cardboard({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 130 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Outer Cardboard Box */}
      <rect
        x="15"
        y="30"
        width="100"
        height="64"
        rx="6"
        fill={active ? '#FEFCE8' : '#FFFDF5'}
        stroke="#4CAF50"
        strokeWidth="2.2"
      />
      
      {/* Flaps / Fold in Warm Smile Yellow */}
      <path d="M15 30 L15 14 Q40 10 65 14 L65 30" fill="#FAEF8A" stroke="#4CAF50" strokeWidth="2" strokeLinejoin="round" />
      <path d="M65 30 L65 14 Q90 10 115 14 L115 30" fill="#FEF08A" stroke="#4CAF50" strokeWidth="2" strokeLinejoin="round" />
      
      {/* Green Packaging Tape Strip */}
      <rect x="61" y="30" width="8" height="64" fill="#68E36D" stroke="#4CAF50" strokeWidth="1.2" />
      
      {/* Texture Details */}
      <line x1="26" y1="54" x2="50" y2="54" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <line x1="26" y1="64" x2="44" y2="64" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <circle cx="95" cy="54" r="5" fill="#FAEF8A" stroke="#4CAF50" strokeWidth="1.5" />
      <path d="M93 54 Q95 56 97 54" stroke="#4CAF50" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function AluminiumCan({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 80 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Can Base */}
      <ellipse cx="40" cy="132" rx="26" ry="8" fill="#E8F8EA" stroke="#4CAF50" strokeWidth="2.2" />
      
      {/* Can Body */}
      <path
        d="M14 26 L14 132 Q40 142 66 132 L66 26 Z"
        fill={active ? '#EDFAF0' : '#F6FCF7'}
        stroke="#4CAF50"
        strokeWidth="2.2"
      />
      
      {/* Can Top Rim in Smile Yellow */}
      <ellipse cx="40" cy="24" rx="26" ry="8" fill="#FAEF8A" stroke="#4CAF50" strokeWidth="2" />
      <ellipse cx="40" cy="22" rx="20" ry="5" fill="#FEF9C3" stroke="#D97706" strokeWidth="1" />
      
      {/* Pull Tab with Green Accent */}
      <path d="M40 15 L43 8 Q46 6 49 7 Q51 10 49 13 L43 15 Z" fill="#68E36D" stroke="#4CAF50" strokeWidth="1.2" />
      
      {/* Diagonal Vibrant Green & Yellow Band */}
      <path d="M14 62 Q40 70 66 62 L66 84 Q40 92 14 84 Z" fill="#FAEF8A" stroke="#EAB308" strokeWidth="1" />
      <path d="M22 73 Q40 79 58 73" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PaperStack({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Back Paper */}
      <rect x="22" y="16" width="76" height="66" rx="5" fill="#FEF9C3" stroke="#4CAF50" strokeWidth="1.8" transform="rotate(-5 22 16)" />
      
      {/* Middle Paper */}
      <rect x="18" y="18" width="76" height="66" rx="5" fill="#E8F8EA" stroke="#4CAF50" strokeWidth="1.8" transform="rotate(3 18 18)" />
      
      {/* Front Paper */}
      <rect
        x="20"
        y="24"
        width="78"
        height="68"
        rx="5"
        fill={active ? '#FFFFFF' : '#FAFCFA'}
        stroke="#4CAF50"
        strokeWidth="2.2"
      />
      
      {/* Yellow Paperclip Accent */}
      <path
        d="M32 20 L32 36 Q32 42 37 42 Q42 42 42 36 L42 22 Q42 15 35 15 Q28 15 28 22 L28 38"
        stroke="#EAB308"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Text Lines */}
      <line x1="48" y1="36" x2="84" y2="36" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="48" x2="84" y2="48" stroke="#4CAF50" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      <line x1="32" y1="58" x2="72" y2="58" stroke="#4CAF50" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      
      {/* Small Leaf/Recycle Accent */}
      <circle cx="80" cy="74" r="5" fill="#FAEF8A" stroke="#4CAF50" strokeWidth="1.2" />
      <path d="M78 74 Q80 77 82 74" stroke="#4CAF50" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const RECYCLABLES = [
  {
    id: 'bottle',
    name: 'Botol PET',
    category: 'Plastik Bersih',
    potential: 'Bisa didaur ulang menjadi botol rPET baru, serat kain tekstil, & dakron bernilai tinggi.',
    Component: PETBottle,
    size: 'w-14 h-22 sm:w-16 sm:h-24',
  },
  {
    id: 'cardboard',
    name: 'Kardus Bekas',
    category: 'Karton Kraft',
    potential: 'Serat kertas kraft dapat diproses ulang hingga 5–7 kali menjadi kemasan baru berkualitas.',
    Component: Cardboard,
    size: 'w-20 h-18 sm:w-22 sm:h-20',
  },
  {
    id: 'can',
    name: 'Kaleng',
    category: 'Aluminium / Logam',
    potential: 'Dapat didaur ulang 100% tanpa batas tanpa sedikitpun menurunkan kualitas material aslinya.',
    Component: AluminiumCan,
    size: 'w-14 h-22 sm:w-16 sm:h-24',
  },
  {
    id: 'paper',
    name: 'Kertas',
    category: 'Arsip & Dupleks',
    potential: 'Setiap ton kertas yang disetor menghemat 17 pohon dan ribuan liter air bersih industri.',
    Component: PaperStack,
    size: 'w-18 h-18 sm:w-20 sm:h-20',
  },
];

export function AboutBelief() {
  const [selectedId, setSelectedId] = useState<string>('can');
  const activeItem = RECYCLABLES.find((r) => r.id === selectedId) || RECYCLABLES[0];

  return (
    <section
      id="cara-pandang"
      className="bg-[#FAFBF9] border-b border-gray-100/90 overflow-hidden py-20 sm:py-24 lg:py-28 scroll-mt-20"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">

        {/* ── HEADER ── */}
        <div className="text-center max-w-2xl mx-auto">
          
          {/* Main Eyebrow */}
          <div className="inline-flex items-center gap-2.5 mb-4 sm:mb-5">
            <span className="font-sans font-semibold text-xs tracking-[0.2em] text-functional-green uppercase select-none">
              CARA PANDANG SI:)SA
            </span>
          </div>

          {/* Main Headline (Single font family throughout, bold/extrabold, NO script/italic) */}
          <h2 className="font-sans font-extrabold text-[#1A202C] tracking-tight text-3xl sm:text-4xl lg:text-[2.65rem] leading-[1.2] text-center">
            Kami melihat sampah{' '}
            <span className="text-functional-green font-extrabold">
              dari sisi yang berbeda.
            </span>
          </h2>

          {/* Body Paragraph (Two concise lines, clean layout, no awkward forced breaks) */}
          <p className="mt-5 sm:mt-6 font-sans text-[#4A5568] text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Botol kosong, kardus, dan kertas bukan akhir dari cerita. SI:)SA hadir untuk bantu kamu memilah dan memberi sampah daur ulang kesempatan kedua.
          </p>
        </div>

        {/* ── MATERIAL STUDY SECTION ── */}
        <div className="mt-14 sm:mt-16 max-w-4xl mx-auto">
          
          {/* Section Sub-Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-7">
            <span className="block h-px w-6 sm:w-10 bg-gray-200" aria-hidden="true" />
            <span className="font-mono text-[11px] font-semibold text-gray-400 uppercase tracking-[0.18em] select-none">
              STUDI MATERIAL SI:)SA
            </span>
            <span className="block h-px w-6 sm:w-10 bg-gray-200" aria-hidden="true" />
          </div>

          {/* Horizontal Row of 4 Interactive Cards (+20% size, subtle rounded corners, light bg, faint shadow) */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4"
            role="tablist"
            aria-label="Pilihan material daur ulang"
          >
            {RECYCLABLES.map((item) => {
              const isSelected = selectedId === item.id;
              const { Component } = item;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={item.name}
                  className={`group relative flex flex-col items-center justify-between p-5 sm:p-6 min-h-[200px] sm:min-h-[220px] rounded-2xl cursor-pointer text-center transition-all duration-200 outline-none ${
                    isSelected
                      ? 'bg-white border-2 border-functional-green shadow-md ring-4 ring-functional-green/10 -translate-y-0.5'
                      : 'bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-gray-200 hover:-translate-y-1'
                  }`}
                >
                  {/* Subtle active indicator dot */}
                  {isSelected && (
                    <span
                      className="absolute top-3 right-3 w-2 h-2 rounded-full bg-functional-green"
                      aria-hidden="true"
                    />
                  )}

                  {/* Enlarged Icon Container (+20% size) */}
                  <div className="flex-1 flex items-center justify-center w-full my-auto py-2">
                    <div className={`${item.size} flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
                      <Component active={isSelected} />
                    </div>
                  </div>

                  {/* Card Title & Category */}
                  <div className="mt-auto w-full pt-2">
                    <span
                      className={`block font-sans font-semibold text-sm sm:text-base transition-colors duration-150 ${
                        isSelected ? 'text-functional-green' : 'text-[#1A202C]'
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="block text-[11px] text-gray-400 font-mono mt-0.5 tracking-wide">
                      {item.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── DETAIL BOX (Directly underneath with minimal vertical padding) ── */}
          <div className="mt-4 sm:mt-4.5 w-full bg-white rounded-2xl border border-gray-100 shadow-xs p-5 sm:p-6 flex items-start gap-4 transition-all duration-200">
            {/* Eco Check Badge */}
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-functional-green flex items-center justify-center shrink-0 font-bold text-sm border border-emerald-100/80 mt-0.5">
              ✓
            </div>

            {/* Active Item Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-sans font-bold text-[#1A202C] text-base sm:text-lg">
                  {activeItem.name}
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium font-mono">
                  {activeItem.category}
                </span>
              </div>
              <p className="font-sans text-[#4A5568] text-sm sm:text-[0.9375rem] mt-1.5 leading-relaxed">
                {activeItem.potential}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
