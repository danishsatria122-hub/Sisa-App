'use client';

import { useState } from 'react';

export function AboutProblem() {
  const [activeTab, setActiveTab] = useState<'discarded' | 'revalued'>('revalued');

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28 lg:py-32 border-b border-gray-100">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        
        {/* Section Header: Left-aligned editorial */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1.5 border border-amber-100 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-amber-900 uppercase">
              KENAPA SI:)SA ADA
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-medium tracking-tight text-gray-900 leading-[1.2]">
            “Kita terlalu cepat menyebutnya <span className="text-gray-400 line-through decoration-red-400 decoration-2">‘sampah’</span>.”
          </h2>

          <div className="mt-6 space-y-4 font-sans text-base sm:text-lg text-gray-600 leading-relaxed">
            <p>
              Banyak benda yang kita buang sebenarnya masih memiliki nilai.
              Botol plastik, kardus, kaleng, dan kertas dapat kembali memiliki fungsi ketika dipilah dan dikelola dengan tepat.
            </p>
            <p className="font-medium text-gray-800">
              Masalahnya bukan selalu pada sampahnya. Kadang, kita hanya belum tahu harus membawanya ke mana.
            </p>
          </div>
        </div>

        {/* Transformation Display: Editorial interactive comparison */}
        <div className="mt-14 lg:mt-18 rounded-3xl bg-[#F8F9FA] p-6 sm:p-10 lg:p-12 border border-gray-200/70">
          
          {/* State Switcher Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-gray-400 block">TRANSFORMASI PERSPEKTIF</span>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {activeTab === 'discarded' ? 'Kondisi 01: Dianggap Selesai' : 'Kondisi 02: Masih Punya Nilai'}
              </h3>
            </div>

            <div className="inline-flex rounded-xl bg-white p-1 shadow-xs border border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab('discarded')}
                className={`rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                  activeTab === 'discarded'
                    ? 'bg-gray-800 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dianggap Selesai
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('revalued')}
                className={`rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                  activeTab === 'revalued'
                    ? 'bg-functional-green text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Masih Punya Nilai :)
              </button>
            </div>
          </div>

          {/* Transformation Visual Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* ITEM 1: Plastik PET */}
            <div
              className={`rounded-2xl border p-6 transition-all duration-300 ${
                activeTab === 'discarded'
                  ? 'bg-white/60 border-gray-200/80 grayscale opacity-75'
                  : 'bg-white border-emerald-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>01</span>
                <span>{activeTab === 'discarded' ? 'DIBUANG' : 'TERPILAH'}</span>
              </div>
              <div className="my-6 h-28 flex items-center justify-center">
                <svg viewBox="0 0 100 120" className="h-full w-auto">
                  <path
                    d="M 38 20 L 62 20 C 66 20, 68 28, 67 45 L 65 100 C 64 108, 58 112, 50 112 C 42 112, 36 108, 35 100 L 33 45 C 32 28, 34 20, 38 20 Z"
                    fill={activeTab === 'discarded' ? '#CBD5E1' : '#B2EBF2'}
                    stroke={activeTab === 'discarded' ? '#94A3B8' : '#4CAF50'}
                    strokeWidth="2"
                  />
                  <rect x="42" y="10" width="16" height="10" rx="2" fill={activeTab === 'discarded' ? '#94A3B8' : '#00ACC1'} />
                  {activeTab === 'revalued' && (
                    <text x="50" y="70" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#2E7D32">
                      ♻ PET
                    </text>
                  )}
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">Botol Minuman</h4>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                {activeTab === 'discarded'
                  ? 'Dibuang ke TPA, butuh 450 tahun untuk terurai.'
                  : 'Dilebur menjadi serat tekstil, tali daur ulang, atau botol baru.'}
              </p>
              {activeTab === 'revalued' && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Nilai Setoran</span>
                  <span className="font-semibold text-functional-green">150 Poin / kg</span>
                </div>
              )}
            </div>

            {/* ITEM 2: Kardus */}
            <div
              className={`rounded-2xl border p-6 transition-all duration-300 ${
                activeTab === 'discarded'
                  ? 'bg-white/60 border-gray-200/80 grayscale opacity-75'
                  : 'bg-white border-amber-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>02</span>
                <span>{activeTab === 'discarded' ? 'DIBUANG' : 'TERPILAH'}</span>
              </div>
              <div className="my-6 h-28 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="h-full w-auto">
                  <path d="M 20 40 L 70 20 L 100 45 L 50 65 Z" fill={activeTab === 'discarded' ? '#CBD5E1' : '#E8B884'} />
                  <path d="M 20 40 L 50 65 L 50 105 L 20 80 Z" fill={activeTab === 'discarded' ? '#94A3B8' : '#CF985F'} />
                  <path d="M 50 65 L 100 45 L 100 85 L 50 105 Z" fill={activeTab === 'discarded' ? '#64748B' : '#B37C45'} />
                  {activeTab === 'revalued' && (
                    <path d="M 45 30 L 60 24 L 68 82 L 53 88 Z" fill="#4CAF50" fillOpacity="0.9" />
                  )}
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">Kardus Paket</h4>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                {activeTab === 'discarded'
                  ? 'Basah, tercampur sampah organik, dan kehilangan daya seratnya.'
                  : 'Dijaga kering & bersih, siap diproses menjadi karton kemasan baru.'}
              </p>
              {activeTab === 'revalued' && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Nilai Setoran</span>
                  <span className="font-semibold text-amber-700">120 Poin / kg</span>
                </div>
              )}
            </div>

            {/* ITEM 3: Kaleng Alumunium */}
            <div
              className={`rounded-2xl border p-6 transition-all duration-300 ${
                activeTab === 'discarded'
                  ? 'bg-white/60 border-gray-200/80 grayscale opacity-75'
                  : 'bg-white border-teal-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>03</span>
                <span>{activeTab === 'discarded' ? 'DIBUANG' : 'TERPILAH'}</span>
              </div>
              <div className="my-6 h-28 flex items-center justify-center">
                <svg viewBox="0 0 100 120" className="h-full w-auto">
                  <path
                    d="M 30 35 C 30 30, 40 26, 50 26 C 60 26, 70 30, 70 35 L 70 95 C 70 100, 60 104, 50 104 C 40 104, 30 100, 30 95 Z"
                    fill={activeTab === 'discarded' ? '#CBD5E1' : '#CBD5E1'}
                    stroke={activeTab === 'discarded' ? '#94A3B8' : '#0F766E'}
                    strokeWidth="2"
                  />
                  <ellipse cx="50" cy="35" rx="20" ry="6" fill={activeTab === 'discarded' ? '#94A3B8' : '#E2E8F0'} />
                  {activeTab === 'revalued' && (
                    <rect x="36" y="55" width="28" height="18" rx="2" fill="#FFFFFF" fillOpacity="0.9" />
                  )}
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">Kaleng Minuman</h4>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                {activeTab === 'discarded'
                  ? 'Terbuang sia-sia meski alumunium bisa didaur ulang tanpa batas.'
                  : 'Dilebur kembali dengan hemat 95% energi dibanding menambang bauksit.'}
              </p>
              {activeTab === 'revalued' && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Nilai Setoran</span>
                  <span className="font-semibold text-teal-700">200 Poin / kg</span>
                </div>
              )}
            </div>

            {/* ITEM 4: Kertas & Dokumen */}
            <div
              className={`rounded-2xl border p-6 transition-all duration-300 ${
                activeTab === 'discarded'
                  ? 'bg-white/60 border-gray-200/80 grayscale opacity-75'
                  : 'bg-white border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>04</span>
                <span>{activeTab === 'discarded' ? 'DIBUANG' : 'TERPILAH'}</span>
              </div>
              <div className="my-6 h-28 flex items-center justify-center">
                <svg viewBox="0 0 100 120" className="h-full w-auto">
                  <path
                    d="M 25 25 L 65 15 L 80 95 L 40 105 Z"
                    fill={activeTab === 'discarded' ? '#E2E8F0' : '#FFFFFF'}
                    stroke={activeTab === 'discarded' ? '#94A3B8' : '#94A3B8'}
                    strokeWidth="1.5"
                  />
                  <line x1="38" y1="36" x2="68" y2="28" stroke="#CBD5E1" strokeWidth="1.5" />
                  <line x1="40" y1="48" x2="72" y2="40" stroke="#CBD5E1" strokeWidth="1.5" />
                  <line x1="42" y1="60" x2="74" y2="52" stroke="#CBD5E1" strokeWidth="1.5" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">Kertas HVS & Buku</h4>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                {activeTab === 'discarded'
                  ? 'Menumpuk di sudut kamar, akhirnya dibakar dan mencemari udara.'
                  : 'Dicacah menjadi bubur kertas (pulp) untuk buku cetak generasi baru.'}
              </p>
              {activeTab === 'revalued' && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Nilai Setoran</span>
                  <span className="font-semibold text-blue-700">90 Poin / kg</span>
                </div>
              )}
            </div>

          </div>

          {/* Editorial Conclusion Quote */}
          <div className="mt-10 rounded-2xl bg-white p-6 border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-gray-600 font-sans italic">
              “Ketika jalur penampungannya jelas, apa yang kita anggap &lsquo;selesai&apos; berubah menjadi permulaan baru.”
            </p>
            <span className="shrink-0 text-xs font-semibold text-functional-green">
              SI:)SA Bridge System
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
