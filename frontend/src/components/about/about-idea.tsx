'use client';

export function AboutIdea() {
  const JOURNEY_STEPS = [
    {
      step: '01',
      phase: 'WASTE',
      title: 'Material Terpilah',
      desc: 'Benda yang tidak lagi terpakai dipisahkan berdasarkan kategorinya secara bersih dan rapi.',
      tag: 'Awal Perjalanan',
      metric: 'Bahan Baku',
    },
    {
      step: '02',
      phase: 'VALUE',
      title: 'Nilai Terukur',
      desc: 'Ditimbang secara akurat dan transparan, lalu dikonversi langsung menjadi poin berharga di dompet digital.',
      tag: 'Apresiasi Nyata',
      metric: 'Poin :)',
    },
    {
      step: '03',
      phase: 'IMPACT',
      title: 'Siklus Berkelanjutan',
      desc: 'Material tersalurkan ke industri daur ulang, sementara poinmu ditukar dengan hadiah dan kebutuhan sehari-hari.',
      tag: 'Dampak Bersama',
      metric: 'Kesempatan Kedua',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FAFAF8] py-20 sm:py-28 lg:py-32 border-b border-gray-100">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 border border-emerald-100 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-functional-green" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-functional-green uppercase">
              THE IDEA
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-medium tracking-tight text-gray-900 leading-[1.2]">
            “Dari ‘buang’ menjadi <span className="text-functional-green">‘beri kesempatan kedua’</span>.”
          </h2>

          <div className="mt-6 space-y-4 font-sans text-base sm:text-lg text-gray-600 leading-relaxed">
            <p>
              SI:)SA hadir untuk membuat pengelolaan sampah daur ulang terasa lebih sederhana, transparan, dan bernilai.
            </p>
            <p className="font-medium text-gray-800">
              Melalui SI:)SA, sampah yang masih memiliki nilai dapat disalurkan dengan lebih terarah, dicatat dengan jelas, dan diubah menjadi sesuatu yang kembali bermanfaat.
            </p>
          </div>
        </div>

        {/* Conceptual Journey: WASTE → VALUE → IMPACT */}
        <div className="mt-14 lg:mt-18">
          
          {/* Subtle journey label */}
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-6 px-1">
            <span>ALUR KONSEPTUAL TRANSFORMASI</span>
            <span className="hidden sm:inline">WASTE → VALUE → IMPACT</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {JOURNEY_STEPS.map((item, idx) => (
              <div
                key={item.phase}
                className="group relative rounded-3xl bg-white p-8 sm:p-10 border border-gray-200/80 shadow-xs transition-all duration-300 hover:shadow-md hover:border-functional-green/40"
              >
                {/* Top Metatag */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-gray-400">
                    STEP {item.step}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                    {item.tag}
                  </span>
                </div>

                {/* Big Phase Word */}
                <div className="mt-6">
                  <span className="block font-mono text-xs font-semibold tracking-widest text-functional-green uppercase">
                    Fase {item.phase}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                </div>

                {/* Abstract Visual Cue per Phase */}
                <div className="my-8 h-24 rounded-2xl bg-[#F8F9FA] p-4 flex items-center justify-center border border-gray-100">
                  {idx === 0 && (
                    /* Organized Materials Visual */
                    <svg viewBox="0 0 160 60" className="h-full w-auto">
                      <rect x="20" y="15" width="24" height="35" rx="3" fill="#B2EBF2" stroke="#4CAF50" strokeWidth="1.5" />
                      <rect x="52" y="10" width="35" height="40" rx="3" fill="#E8B884" stroke="#CF985F" strokeWidth="1.5" />
                      <rect x="95" y="20" width="22" height="30" rx="4" fill="#CBD5E1" stroke="#0F766E" strokeWidth="1.5" />
                      <path d="M 125 18 L 145 12 L 152 42 L 132 48 Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
                    </svg>
                  )}

                  {idx === 1 && (
                    /* Point / Digital Value Visual */
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-functional-green text-smile-yellow font-bold text-lg shadow-sm">
                        :)
                      </div>
                      <div className="text-left">
                        <span className="block text-xs text-gray-400 font-mono">KONVERSI POIN</span>
                        <span className="text-base font-bold text-gray-900">+150 Poin / kg</span>
                      </div>
                    </div>
                  )}

                  {idx === 2 && (
                    /* Circular Impact / Second Chance Visual */
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-functional-green">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="block text-xs text-gray-400 font-mono">HASIL AKHIR</span>
                        <span className="text-sm font-semibold text-gray-900">Produk Baru & Hadiah</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="font-sans text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>

                {/* Bottom Metric Label */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Fokus:</span>
                  <span className="font-semibold text-gray-800">{item.metric}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
