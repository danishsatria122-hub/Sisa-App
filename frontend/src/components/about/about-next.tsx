'use client';

import { useEffect, useState, useRef } from 'react';

export function AboutNext() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setInView(true); return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const columns = [
    { num: '01', title: 'Lebih banyak kategori' },
    { num: '02', title: 'Lebih banyak mitra' },
    { num: '03', title: 'Lebih banyak cara untuk memberi nilai pada yang tersisa.' },
  ];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FAFAFA] border-b border-gray-100/90 overflow-visible"
      style={{
        /*
         * 05 is immediately after the LOCKED Filosofi section (py-28 = 112px bottom).
         * Filosofi's own 112px bottom padding already provides the gap, so our top = 0.
         * Bottom = half-gap normally.
         */
        paddingTop:    '0px',
        paddingBottom: 'clamp(32px, 4vh, 48px)',
      }}
      aria-label="Berikutnya di SI:)SA"
    >
      <div className="mx-auto max-w-[1120px] px-6 sm:px-8">

        {/* ── HEADER ── */}
        <div className="max-w-2xl">
          {/* Eyebrow — 12px to headline */}
          <div className="inline-flex items-center gap-2" style={{ marginBottom: '12px' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-functional-green shrink-0" aria-hidden="true" />
            <span className="t-eyebrow text-functional-green select-none">BERIKUTNYA</span>
          </div>

          {/* Headline */}
          <h2
            className="font-display font-bold text-gray-900 [text-wrap:balance]"
            style={{
              fontSize: 'clamp(1.875rem, 3.6vw, 2.75rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
            }}
          >
            SI:)SA masih{' '}
            <span className="text-functional-green">
              terus berkembang.
            </span>
          </h2>

          {/* Intro — 14px below headline */}
          <p
            className="font-sans font-light text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl"
            style={{ marginTop: '14px' }}
          >
            SI:)SA dibangun sebagai langkah awal untuk membuat pengelolaan sampah terasa lebih sederhana, terhubung, dan bernilai.
          </p>
        </div>

        {/* ── THREE OPEN COLUMNS — 36px below header ── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{ marginTop: '36px', gap: '24px' }}
        >
          {columns.map((col) => (
            <div key={col.num} className="border-t border-gray-200 pt-6 flex flex-col justify-start">
              <span className="font-sans font-extrabold text-functional-green text-sm tracking-wider">
                {col.num}
              </span>
              <h3 className="mt-3 font-display font-bold text-gray-900 text-lg sm:text-xl lg:text-2xl leading-snug">
                {col.title}
              </h3>
            </div>
          ))}
        </div>

        {/* ── CLOSING LINE — 40px below columns ── */}
        <div className="border-t border-gray-200/80 max-w-3xl" style={{ marginTop: '40px', paddingTop: '28px' }}>
          <p className="font-display font-medium text-gray-800 text-lg sm:text-xl lg:text-[1.375rem] leading-relaxed">
            Dibangun, diuji, dan terus dikembangkan dari satu ide sederhana: memberi kesempatan kedua pada yang tersisa.
          </p>
        </div>

      </div>
    </section>
  );
}
