'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { SisaSmileIcon } from '@/components/sisa-logo';

const NODES = [
  { id: 1, label: 'Sampah' },
  { id: 2, label: 'Dipilah' },
  { id: 3, label: 'Disetor' },
  { id: 4, label: 'Ditimbang' },
  { id: 5, label: 'Bernilai', isSmile: true },
];

export function AboutToday() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setInView(true); return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FAFAFA] overflow-visible"
      style={{
        /*
         * 03 is immediately before the LOCKED Filosofi section (py-28 = 112px top).
         * To keep visible gap ≈ about-gap (64–96px), we only need our bottom padding
         * to be a small buffer; Filosofi's own 112px top padding already exceeds the gap.
         * So: top = half-gap; bottom = 0 (let Filosofi carry the space).
         */
        paddingTop:    'clamp(32px, 4vh, 48px)',
        paddingBottom: '0px',
        /* No border-b — Filosofi has its own top border treatment */
      }}
      aria-label="Hari Ini di SI:)SA"
    >
      <div className="mx-auto max-w-[1120px] px-6 sm:px-8">

        {/* ── HEADER ── */}
        <div className="max-w-2xl">
          {/* Eyebrow — 12px gap to headline */}
          <div className="inline-flex items-center gap-2" style={{ marginBottom: '12px' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-functional-green shrink-0" aria-hidden="true" />
            <span className="t-eyebrow text-functional-green select-none">HARI INI</span>
          </div>

          {/* Headline — 14px gap to intro (no intro here, gap goes to flow) */}
          <h2
            className="font-display font-bold text-gray-900 [text-wrap:balance]"
            style={{
              fontSize: 'clamp(1.875rem, 3.6vw, 2.75rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
            }}
          >
            Dari benda yang dianggap selesai,{' '}
            <span className="text-functional-green">
              kembali bernilai.
            </span>
          </h2>
        </div>

        {/* ── SLIM FLOW — 32px below header ── */}
        <div style={{ marginTop: '32px' }}>

          {/* Desktop Flow */}
          <div className="hidden sm:block relative pt-4 pb-2">
            <div className="absolute top-[26px] left-[5%] right-[5%] h-[1px] bg-gray-200" aria-hidden="true">
              <div
                className="h-full bg-functional-green transition-all duration-900 ease-out origin-left"
                style={{ width: inView ? '100%' : '0%' }}
              />
            </div>

            <div className="relative flex items-start justify-between">
              {NODES.map((node, index) => (
                <div
                  key={node.id}
                  className="flex flex-col items-center text-center transition-all duration-500 ease-out"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(8px)',
                    transitionDelay: `${index * 140 + 200}ms`,
                  }}
                >
                  <div className="flex items-center justify-center h-5 w-5 rounded-full bg-[#FAFAFA] z-10">
                    {node.isSmile ? (
                      <div
                        className="flex items-center justify-center transition-opacity duration-600 ease-out"
                        style={{ opacity: inView ? 1 : 0, transitionDelay: '800ms' }}
                      >
                        <SisaSmileIcon size={22} color="var(--smile-yellow, #FAEF8A)" />
                      </div>
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-functional-green ring-4 ring-[#FAFAFA]" />
                    )}
                  </div>
                  <span
                    className={`mt-3 font-sans text-sm sm:text-base ${
                      node.isSmile ? 'font-semibold text-functional-green' : 'font-medium text-gray-700'
                    }`}
                  >
                    {node.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Flow */}
          <div className="sm:hidden relative pl-6">
            <div className="absolute top-2 bottom-6 left-[11px] w-[1px] bg-gray-200" aria-hidden="true">
              <div
                className="w-full bg-functional-green transition-all duration-900 ease-out origin-top"
                style={{ height: inView ? '100%' : '0%' }}
              />
            </div>
            <div className="space-y-6">
              {NODES.map((node, index) => (
                <div
                  key={node.id}
                  className="flex items-center gap-4 transition-all duration-500 ease-out"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateX(0)' : 'translateX(-8px)',
                    transitionDelay: `${index * 120 + 150}ms`,
                  }}
                >
                  <div className="flex items-center justify-center h-6 w-6 -ml-[12px] bg-[#FAFAFA] z-10">
                    {node.isSmile ? (
                      <SisaSmileIcon size={20} color="var(--smile-yellow, #FAEF8A)" />
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-functional-green ring-4 ring-[#FAFAFA]" />
                    )}
                  </div>
                  <span
                    className={`font-sans text-base ${
                      node.isSmile ? 'font-semibold text-functional-green' : 'font-medium text-gray-700'
                    }`}
                  >
                    {node.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── LINK — 24px below flow ── */}
        <div style={{ marginTop: '24px', paddingBottom: 'clamp(32px, 4vh, 48px)' }}>
          <Link
            href="/#cara-kerja"
            className="group inline-flex items-center gap-1.5 font-sans font-semibold text-functional-green text-sm sm:text-base hover:text-green-800 transition-colors"
          >
            <span className="relative">
              Lihat cara kerja lengkap
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-functional-green group-hover:w-full transition-all duration-300 ease-out" />
            </span>
            <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
