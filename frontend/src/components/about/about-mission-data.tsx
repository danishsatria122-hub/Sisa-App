'use client';

import { useEffect, useState, useRef } from 'react';

export function AboutMissionData() {
  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState({ stat1: 0, stat2: 0, stat3: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setInView(true);
      setCounts({ stat1: 56.63, stat2: 39.01, stat3: 22 });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();

          const duration = 1200;
          const startTime = performance.now();
          const update = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCounts({
              stat1: Number((56.63 * ease).toFixed(2)),
              stat2: Number((39.01 * ease).toFixed(2)),
              stat3: Math.round(22 * ease),
            });
            if (progress < 1) requestAnimationFrame(update);
            else setCounts({ stat1: 56.63, stat2: 39.01, stat3: 22 });
          };
          requestAnimationFrame(update);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const formatId = (val: number, decimals: number = 2) =>
    val.toLocaleString('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FAFBF9] border-b border-gray-100/90 overflow-visible"
      style={{
        /* half of --about-gap each side → visible gap between sections = ~about-gap */
        paddingTop:    'clamp(32px, 4vh, 48px)',
        paddingBottom: 'clamp(32px, 4vh, 48px)',
      }}
      aria-label="Kenapa SI:)SA Hadir"
    >
      <div className="mx-auto max-w-[1120px] px-6 sm:px-8">

        {/* ── HEADER (left-aligned) ── */}
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2" style={{ marginBottom: '12px' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-functional-green shrink-0" aria-hidden="true" />
            <span className="t-eyebrow text-functional-green select-none">KENAPA SI:)SA HADIR</span>
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
            Masalahnya besar.{' '}
            <span className="text-functional-green">
              Dampaknya dimulai dari hal kecil.
            </span>
          </h2>
        </div>

        {/* ── THREE STATS — 32px below header ── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{
            marginTop: '32px',
            columnGap: 'clamp(24px, 3vw, 40px)',
            rowGap: '24px',
          }}
        >
          {/* Stat 1 */}
          <div className="border-t border-gray-200" style={{ paddingTop: '20px' }}>
            <div className="font-sans font-extrabold tabular-nums text-gray-900 tracking-tight text-4xl sm:text-5xl lg:text-[3.5rem] leading-none">
              {formatId(counts.stat1, 2)}
              <span className="ml-2 font-sans font-bold text-functional-green text-xl sm:text-2xl lg:text-3xl">
                juta ton
              </span>
            </div>
            <p className="font-sans text-sm sm:text-base text-slate-500 font-light leading-relaxed" style={{ marginTop: '6px' }}>
              timbulan sampah nasional, 2023
            </p>
          </div>

          {/* Stat 2 */}
          <div className="border-t border-gray-200" style={{ paddingTop: '20px' }}>
            <div className="font-sans font-extrabold tabular-nums text-gray-900 tracking-tight text-4xl sm:text-5xl lg:text-[3.5rem] leading-none">
              {formatId(counts.stat2, 2)}
              <span className="font-sans font-bold text-functional-green text-3xl sm:text-4xl">%</span>
            </div>
            <p className="font-sans text-sm sm:text-base text-slate-500 font-light leading-relaxed" style={{ marginTop: '6px' }}>
              yang baru dikelola secara layak
            </p>
          </div>

          {/* Stat 3 */}
          <div className="border-t border-gray-200" style={{ paddingTop: '20px' }}>
            <div className="font-sans font-extrabold tabular-nums text-gray-900 tracking-tight text-4xl sm:text-5xl lg:text-[3.5rem] leading-none">
              {counts.stat3}
              <span className="font-sans font-bold text-functional-green text-3xl sm:text-4xl">%</span>
            </div>
            <p className="font-sans text-sm sm:text-base text-slate-500 font-light leading-relaxed" style={{ marginTop: '6px' }}>
              tingkat daur ulang nasional
            </p>
          </div>
        </div>

        {/* ── SOURCE — 16px below stats ── */}
        <p className="font-sans text-[0.8125rem] text-gray-500 leading-relaxed max-w-3xl" style={{ marginTop: '16px' }}>
          Sumber: SIPSN KLH/BPLH, dikutip dari{' '}
          <a
            href="https://www.kemenlh.go.id/news/detail/klh-bplh-tegaskan-arah-baru-menuju-indonesia-bebas-sampah-2029-dalam-rakornas-pengelolaan-sampah-2025"
            target="_blank"
            rel="noopener noreferrer"
            className="text-functional-green font-medium underline underline-offset-2 hover:text-green-800 transition-colors"
          >
            siaran pers
          </a>{' '}
          Rakornas Pengelolaan Sampah 2025 (22 Juni 2025). Angka SIPSN dapat berubah seiring pembaruan input kabupaten/kota.
        </p>

        {/* ── MISSION BLOCK — 48px below source line, two-column gap 48px ── */}
        <div
          className="border-t border-gray-200/80 grid grid-cols-1 md:grid-cols-2 items-baseline"
          style={{
            marginTop: '48px',
            paddingTop: '32px',
            gap: '48px',
          }}
        >
          {/* Left: Lead Style */}
          <div className="font-display font-semibold text-gray-900 text-xl sm:text-2xl lg:text-[1.625rem] leading-snug">
            SI<span className="text-functional-green font-bold">:)</span>SA hadir untuk membuat proses itu lebih mudah.
          </div>

          {/* Right: Light Body */}
          <div className="font-sans font-light text-slate-600 text-base sm:text-lg leading-relaxed">
            Kami menghubungkan pemilahan, penyetoran, penimbangan, hingga pemberian nilai dalam satu pengalaman yang sederhana.
          </div>
        </div>

      </div>
    </section>
  );
}
