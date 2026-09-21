'use client';

import { useEffect, useState } from 'react';

/* ─── Shared curved-underline SVG ──────────────────────────────────────────
   Stroke thickness : 0.055em  (scales with font-size)
   Gap from baseline: 0.18em   (clear space, never overlaps text)
   Shape            : same Q-curve as landing hero "smile" underline
   Overhang         : ~0.03em each side (path starts at 1, ends at 99 in a 100-unit box)
   Animation        : scaleX 0→1 from left, 600ms, once on mount
   prefers-reduced-motion: static (no animation)
──────────────────────────────────────────────────────────────────────────── */
export function AboutOpening() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setAnimated(true); return; }
    const timer = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative w-full bg-[#FAFBF9] border-b border-gray-100/80 overflow-visible flex items-center justify-center"
      style={{
        /* 01 Opening: tighter height so section 02 header is visible at 1440×900 */
        minHeight: 'clamp(340px, 48svh, 420px)',
        /* ~48px below navbar, stays short */
        paddingTop:    'clamp(32px, 4.5vh, 52px)',
        paddingBottom: 'clamp(32px, 4.5vh, 52px)',
      }}
      aria-label="About SI:)SA opening"
    >
      <div className="relative z-10 mx-auto w-full max-w-[800px] px-6 sm:px-8 text-center flex flex-col items-center">

        {/* ── Eyebrow — 12px below eyebrow to headline (mb-3) ── */}
        <div
          className="inline-flex items-center gap-2 mb-3"
          style={{
            opacity: animated ? 1 : 0,
            transform: animated ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-functional-green shrink-0" aria-hidden="true" />
          <span className="t-eyebrow text-functional-green select-none">ABOUT SI:)SA</span>
        </div>

        {/* ── h1 Headline ── */}
        <h1
          className="font-display font-bold text-gray-900 [text-wrap:balance] w-full"
          style={{
            fontSize: 'clamp(1.875rem, 3.6vw, 2.75rem)',
            lineHeight: 1.15,   /* ≥1.15 so underline never touches next line */
            letterSpacing: '-0.03em',
            maxWidth: '22em',
            opacity: animated ? 1 : 0,
            transform: animated ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 600ms cubic-bezier(0.16,1,0.3,1) 100ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 100ms',
          }}
        >
          Kami percaya, sesuatu yang dianggap selesai{' '}
          <span className="text-functional-green">
            belum tentu
          </span>
          {' '}kehilangan nilainya.
        </h1>

        {/* ── Subcopy — 14px below headline (mt-[14px]) ── */}
        <p
          className="font-sans font-light text-slate-600 leading-[1.65] max-w-[34em] mx-auto [text-wrap:balance]"
          style={{
            fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
            marginTop: '14px',
            opacity: animated ? 1 : 0,
            transform: animated ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 600ms cubic-bezier(0.16,1,0.3,1) 220ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 220ms',
          }}
        >
          SI:)SA lahir dari sebuah cara pandang sederhana: memberi kesempatan kedua pada sesuatu yang masih memiliki nilai.
        </p>

      </div>
    </section>
  );
}
