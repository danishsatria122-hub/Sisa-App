'use client';

import { useState, useRef, useEffect } from 'react';
import { SisaSmileIcon } from '@/components/sisa-logo';

interface RowItem {
  id: string;
  number: string;
  glyphTitle: string;
  text: string;
}

const ROWS: RowItem[] = [
  {
    id: 'SI',
    number: '01',
    glyphTitle: 'SI',
    text: 'Awal kata "sisa". Sesuatu yang tertinggal.',
  },
  {
    id: 'smile',
    number: '02',
    glyphTitle: 'smile',
    text: 'Senyum kecil untuk hal-hal yang sering terabaikan.',
  },
  {
    id: 'SA',
    number: '03',
    glyphTitle: 'SA',
    text: 'Penutup kata "sisa". Yang tersisa layak diberi kesempatan lagi.',
  },
];

export function AboutIdentity() {
  const [activePart, setActivePart] = useState<string>('smile');
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState<boolean>(false);

  const handleSelectPart = (id: string) => {
    setActivePart(id);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isSiActive = activePart === 'SI';
  const isSmileActive = activePart === 'smile';
  const isSaActive = activePart === 'SA';

  return (
    <section
      ref={sectionRef}
      className="bg-[#FAFAFA] border-b border-gray-100 py-28 lg:py-36 overflow-hidden"
    >
      {/* Scoped CSS for sketch process moment & guide drawing */}
      <style jsx>{`
        @keyframes drawGuideLine {
          from {
            stroke-dashoffset: 700;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes drawCircleGuide {
          from {
            stroke-dashoffset: 400;
            opacity: 0;
          }
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        @keyframes logoFillFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .anim-guide {
          stroke-dasharray: 700;
          stroke-dashoffset: 700;
          animation: drawGuideLine 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-circle {
          animation: drawCircleGuide 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-logo {
          opacity: 0;
          animation: logoFillFade 500ms cubic-bezier(0.16, 1, 0.3, 1) 750ms forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .anim-guide,
          .anim-circle,
          .anim-logo {
            animation: none !important;
            stroke-dashoffset: 0 !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
            <span className="block h-px w-6 sm:w-8 bg-gray-300" aria-hidden="true" />
            <span className="font-sans text-[0.8125rem] font-semibold tracking-[0.22em] text-gray-500 uppercase select-none">
              FILOSOFI LOGO
            </span>
            <span className="block h-px w-6 sm:w-8 bg-gray-300" aria-hidden="true" />
          </div>

          <h2 className="font-display font-semibold text-[#1E3A20] tracking-tight text-[clamp(2rem,4vw,3.25rem)] leading-[1.15]">
            Lebih dari sekadar <span className="text-functional-green">nama.</span>
          </h2>
        </div>

        {/* ── 12-COLUMN EDITORIAL GRID ── */}
        <div className="mt-14 sm:mt-16 lg:mt-20 flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-12 lg:gap-0">
          
          {/* ── LEFT: SKETCH SHEET (Columns 1-7) ── */}
          <div className="w-full lg:col-span-7 flex flex-col justify-center select-none">
            <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] max-w-[680px] mx-auto lg:max-w-none flex items-center justify-center">
              
              <svg
                viewBox="0 0 680 340"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Lembar sketsa konstruksi logo SI:)SA"
              >
                {/* ── CONSTRUCTION GUIDES (1px muted navy ~25% default) ── */}
                <g className={isInView ? 'anim-guide' : 'opacity-0'}>
                  
                  {/* Cap-Height Line (hidden on mobile, visible tablet/desktop) */}
                  <line
                    x1="30"
                    y1="125"
                    x2="650"
                    y2="125"
                    stroke="#1E3A20"
                    strokeWidth="1"
                    className={`transition-opacity duration-250 hidden sm:block ${
                      isSiActive || isSaActive ? 'stroke-opacity-65' : 'stroke-opacity-25'
                    }`}
                  />

                  {/* Baseline Line (always visible on mobile, tablet, desktop) */}
                  <line
                    x1="30"
                    y1="215"
                    x2="650"
                    y2="215"
                    stroke="#1E3A20"
                    strokeWidth="1"
                    className={`transition-opacity duration-250 ${
                      isSiActive || isSaActive ? 'stroke-opacity-65' : 'stroke-opacity-25'
                    }`}
                  />

                  {/* Center Vertical Guide Through Smile */}
                  <line
                    x1="340"
                    y1="50"
                    x2="340"
                    y2="290"
                    stroke={isSmileActive ? 'var(--functional-green, #4CAF50)' : '#1E3A20'}
                    strokeWidth="1"
                    className={`transition-all duration-250 ${
                      isSmileActive ? 'stroke-opacity-70' : 'stroke-opacity-20'
                    }`}
                  />

                  {/* Registration Crosshairs: Top-Left (Desktop & Tablet only) */}
                  <g className="hidden sm:block">
                    <line x1="20" y1="30" x2="40" y2="30" stroke="#1E3A20" strokeOpacity="0.25" strokeWidth="1" />
                    <line x1="30" y1="20" x2="30" y2="40" stroke="#1E3A20" strokeOpacity="0.25" strokeWidth="1" />
                    <circle cx="30" cy="30" r="4.5" stroke="#1E3A20" strokeOpacity="0.25" strokeWidth="1" fill="none" />
                  </g>

                  {/* Registration Crosshairs: Bottom-Right (Desktop & Tablet only) */}
                  <g className="hidden sm:block">
                    <line x1="640" y1="310" x2="660" y2="310" stroke="#1E3A20" strokeOpacity="0.25" strokeWidth="1" />
                    <line x1="650" y1="300" x2="650" y2="320" stroke="#1E3A20" strokeOpacity="0.25" strokeWidth="1" />
                    <circle cx="650" cy="310" r="4.5" stroke="#1E3A20" strokeOpacity="0.25" strokeWidth="1" fill="none" />
                  </g>

                </g>

                {/* ── DASHED CIRCLE AROUND SMILE ── */}
                <circle
                  cx="340"
                  cy="170"
                  r="58"
                  stroke={isSmileActive ? 'var(--functional-green, #4CAF50)' : '#1E3A20'}
                  strokeWidth={isSmileActive ? '1.5' : '1'}
                  strokeDasharray="4 4"
                  className={`transition-all duration-250 ${
                    isInView ? 'anim-circle' : 'opacity-0'
                  } ${isSmileActive ? 'stroke-opacity-85' : 'stroke-opacity-30'}`}
                />

                {/* ── ANNOTATIONS (Hidden on Mobile) ── */}
                <g className="hidden sm:block select-none" aria-hidden="true">

                  {/* BASELINE Annotation */}
                  <text
                    x="575"
                    y="210"
                    className="font-sans font-medium transition-all duration-250"
                    fill={isSiActive || isSaActive ? '#1E3A20' : '#1E3A20'}
                    fillOpacity={isSiActive || isSaActive ? '0.85' : '0.4'}
                    fontSize="10"
                    letterSpacing="0.16em"
                  >
                    BASELINE
                  </text>

                  {/* CAP-HEIGHT Annotation */}
                  <text
                    x="560"
                    y="120"
                    className="font-sans font-medium transition-all duration-250"
                    fill={isSiActive || isSaActive ? '#1E3A20' : '#1E3A20'}
                    fillOpacity={isSiActive || isSaActive ? '0.85' : '0.4'}
                    fontSize="10"
                    letterSpacing="0.16em"
                  >
                    CAP-HEIGHT
                  </text>

                  {/* SMILE Annotation */}
                  <text
                    x="340"
                    y="98"
                    textAnchor="middle"
                    className="font-sans font-medium transition-all duration-250"
                    fill={isSmileActive ? 'var(--functional-green, #4CAF50)' : '#1E3A20'}
                    fillOpacity={isSmileActive ? '1' : '0.4'}
                    fontSize="10"
                    letterSpacing="0.16em"
                  >
                    SMILE
                  </text>
                </g>

                {/* ── THE SI:)SA LOGO (Split into SI / smile / SA with original shapes) ── */}
                <g className={isInView ? 'anim-logo' : 'opacity-0'}>
                  
                  {/* 1. "SI" Part */}
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label="Pilih bagian SI"
                    onClick={() => handleSelectPart('SI')}
                    onMouseEnter={() => handleSelectPart('SI')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectPart('SI');
                      }
                    }}
                    className="cursor-pointer outline-none focus-visible:opacity-100"
                  >
                    <text
                      x="180"
                      y="215"
                      textAnchor="middle"
                      className={`font-logo select-none transition-opacity duration-250 ${
                        isSiActive ? 'opacity-100' : 'opacity-50'
                      }`}
                      fill="var(--functional-green, #4CAF50)"
                      fontSize="104"
                      style={{ fontFamily: '"Bagel Fat One", cursive' }}
                    >
                      SI
                    </text>
                  </g>

                  {/* 2. "Smile" Part */}
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label="Pilih bagian Senyum"
                    onClick={() => handleSelectPart('smile')}
                    onMouseEnter={() => handleSelectPart('smile')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectPart('smile');
                      }
                    }}
                    className={`cursor-pointer outline-none transition-opacity duration-250 ${
                      isSmileActive ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    <g transform="translate(295, 129.5) scale(0.9)">
                      {/* Left Eye */}
                      <ellipse cx="26" cy="26" rx="13" ry="21" fill="#F4DC35" />
                      {/* Right Eye */}
                      <ellipse cx="74" cy="26" rx="13" ry="21" fill="#F4DC35" />
                      {/* Smile Curve */}
                      <path
                        d="M 12 52 Q 50 94 88 52 C 94 44 104 52 97 62 Q 50 108 3 62 C -4 52 6 44 12 52 Z"
                        fill="#F4DC35"
                      />
                    </g>
                  </g>

                  {/* 3. "SA" Part */}
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label="Pilih bagian SA"
                    onClick={() => handleSelectPart('SA')}
                    onMouseEnter={() => handleSelectPart('SA')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectPart('SA');
                      }
                    }}
                    className="cursor-pointer outline-none focus-visible:opacity-100"
                  >
                    <text
                      x="500"
                      y="215"
                      textAnchor="middle"
                      className={`font-logo select-none transition-opacity duration-250 ${
                        isSaActive ? 'opacity-100' : 'opacity-50'
                      }`}
                      fill="var(--functional-green, #4CAF50)"
                      fontSize="104"
                      style={{ fontFamily: '"Bagel Fat One", cursive' }}
                    >
                      SA
                    </text>
                  </g>

                </g>
              </svg>
            </div>
          </div>

          {/* ── RIGHT: INDEX LIST (Columns 9-12, Three Rows, 1px Hairlines, No Box) ── */}
          <div className="w-full lg:col-span-4 lg:col-start-9 flex flex-col justify-center">
            
            {/* Small Hint Above List */}
            <div
              className={`font-sans text-[0.8125rem] text-gray-400 mb-3 tracking-wide select-none transition-opacity duration-300 ${
                hasInteracted ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              aria-hidden={hasInteracted}
            >
              Pilih satu bagian
            </div>

            {/* List with 1px hairlines only */}
            <div
              className="w-full flex flex-col border-t border-b border-gray-200"
              role="tablist"
              aria-label="Indeks elemen logo SI:)SA"
            >
              {ROWS.map((r) => {
                const isActive = activePart === r.id;

                return (
                  <button
                    key={r.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`${r.number} ${r.glyphTitle}: ${r.text}`}
                    onClick={() => handleSelectPart(r.id)}
                    onMouseEnter={() => handleSelectPart(r.id)}
                    onFocus={() => handleSelectPart(r.id)}
                    className="group relative flex items-center gap-4 sm:gap-5 py-5 sm:py-6 px-3.5 sm:px-4 text-left w-full transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-functional-green border-b border-gray-200 last:border-b-0"
                  >
                    {/* Active Left Indicator Rule: 3px green on active */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-200 ${
                        isActive ? 'bg-functional-green' : 'bg-transparent group-hover:bg-functional-green/30'
                      }`}
                      aria-hidden="true"
                    />

                    {/* 01 / 02 / 03 Tabular Number in green */}
                    <span className="font-mono text-xs sm:text-[0.8125rem] font-semibold text-functional-green tabular-nums shrink-0 w-5">
                      {r.number}
                    </span>

                    {/* Glyph Title (~44px) */}
                    <div className="w-12 h-11 shrink-0 flex items-center justify-center">
                      {r.id === 'smile' ? (
                        <div
                          className={`transition-opacity duration-250 ${
                            isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'
                          }`}
                        >
                          <SisaSmileIcon size={38} color="#F4DC35" />
                        </div>
                      ) : (
                        <span
                          className={`font-logo text-[38px] sm:text-[42px] leading-none text-functional-green transition-opacity duration-250 ${
                            isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'
                          }`}
                        >
                          {r.glyphTitle}
                        </span>
                      )}
                    </div>

                    {/* Short Text */}
                    <p
                      className={`font-sans text-[0.875rem] sm:text-[0.9375rem] leading-[1.5] transition-colors duration-200 ${
                        isActive ? 'text-gray-900 font-medium' : 'text-gray-500 group-hover:text-gray-700'
                      }`}
                    >
                      {r.text}
                    </p>
                  </button>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
