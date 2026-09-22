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

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#FAFAFA] border-b border-gray-100/90 overflow-visible"
      style={{
        paddingTop: '0px',
        paddingBottom: 'clamp(32px, 4vh, 48px)',
      }}
      aria-label="Berikutnya di SI:)SA"
    >
      <div className="mx-auto max-w-[1120px] px-6 sm:px-8">
        <div className="max-w-[34em]">
          <div className="inline-flex items-center gap-2" style={{ marginBottom: '12px' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-functional-green shrink-0" aria-hidden="true" />
            <span className="t-eyebrow text-functional-green select-none">BERIKUTNYA</span>
          </div>

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

          <p
            className="font-sans font-light text-slate-600 text-base sm:text-lg leading-relaxed"
            style={{ marginTop: '14px', maxWidth: '34em' }}
          >
            SI:)SA dibangun sebagai langkah awal untuk membuat pengelolaan sampah terasa lebih sederhana, terhubung, dan bernilai.
          </p>
        </div>
      </div>
    </section>
  );
}
