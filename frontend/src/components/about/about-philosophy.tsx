'use client';

import { SisaLogo, SisaSmileIcon } from '@/components/sisa-logo';

export function AboutPhilosophy() {
  const MEANINGS = [
    {
      idx: '01',
      title: 'Optimisme',
      desc: 'Memandang barang yang tersisa bukan sebagai beban, melainkan awal dari siklus daur ulang yang baru.',
    },
    {
      idx: '02',
      title: 'Kesempatan Kedua',
      desc: 'Memberi ruang dan jalur yang tepat agar material seperti plastik, kardus, kaleng, dan kertas dapat kembali berguna.',
    },
    {
      idx: '03',
      title: 'Nilai yang Tersisa',
      desc: 'Menyadari bahwa di balik kemasan bekas yang kita pakai sehari-hari selalu tersimpan nilai ekonomi dan ekologis.',
    },
    {
      idx: '04',
      title: 'Hubungan Positif',
      desc: 'Mengubah cara kita memperlakukan sampah dari rasa terpaksa menjadi kebiasaan yang menyenangkan, adil, dan bermakna.',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32 lg:py-36 border-b border-gray-100">
      {/* Background soft green bloom */}
      <div
        className="pointer-events-none absolute -left-24 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary-green/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 text-center">
        
        {/* Section Label */}
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 border border-emerald-200/80 mb-8">
          <span className="h-2 w-2 rounded-full bg-primary-green" />
          <span className="text-[11px] font-semibold tracking-[0.22em] text-functional-green uppercase">
            THE MEANING BEHIND SI:)SA
          </span>
        </div>

        {/* Prominent Brand Logo */}
        <div className="flex items-center justify-center my-4 transition-transform duration-300 hover:scale-105">
          <SisaLogo variant="two-tone" height={64} />
        </div>

        {/* Smile Icon as Brand Philosophy Emblem */}
        <div className="flex items-center justify-center gap-3 mt-4 mb-8">
          <div className="h-px w-16 bg-gray-200" />
          <SisaSmileIcon size={32} color="var(--smile-yellow, #FAEF8A)" />
          <div className="h-px w-16 bg-gray-200" />
        </div>

        {/* Headline */}
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-medium text-gray-900 leading-[1.22] tracking-tight max-w-3xl mx-auto">
          Sedikit senyum untuk sesuatu<br />
          <span className="text-functional-green">yang masih punya arti.</span>
        </h2>

        {/* Philosophy Copy */}
        <p className="mt-7 font-sans text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
          Simbol{' '}
          <strong className="font-semibold text-gray-900 font-display text-xl">:)</strong>
          {' '}di tengah nama SI:)SA bukan sekadar hiasan. Ia adalah cara pandang kami bahwa kepedulian terhadap lingkungan dapat dimulai dengan niat baik yang sederhana dan tulus.
        </p>

        {/* 4 Meaning Pillars */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
          {MEANINGS.map((item) => (
            <div key={item.idx} className="bg-white p-7 text-left hover:bg-emerald-50/40 transition-colors duration-300 group">
              <span className="font-mono text-xs font-semibold text-functional-green tracking-widest block mb-3">
                {item.idx}
              </span>
              <h3 className="font-display text-lg font-semibold text-gray-900 mb-2 group-hover:text-functional-green transition-colors">
                {item.title}
              </h3>
              <p className="font-sans text-sm text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
