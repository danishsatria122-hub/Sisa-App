'use client';

import { useState, useEffect, useRef } from 'react';
import { SisaSmileIcon } from './sisa-logo';
import { SisaSmileWatermark, SisaSmilePatternGrid } from './sisa-smile-watermark';

type RecyclableItem = 'pet' | 'cardboard' | 'can' | 'paper' | null;

interface ItemMeta {
  name: string;
  value: string;
  badgeBg: string;
}

const ITEMS_DATA: Record<'pet' | 'cardboard' | 'can' | 'paper', ItemMeta> = {
  pet: {
    name: 'Plastik PET',
    value: '+150 :) / kg',
    badgeBg: 'bg-white text-gray-900 border-white/80 shadow-md',
  },
  cardboard: {
    name: 'Kardus & Karton',
    value: '+120 :) / kg',
    badgeBg: 'bg-white text-gray-900 border-white/80 shadow-md',
  },
  can: {
    name: 'Alumunium',
    value: '+200 :) / kg',
    badgeBg: 'bg-white text-gray-900 border-white/80 shadow-md',
  },
  paper: {
    name: 'Kertas & Majalah',
    value: '+90 :) / kg',
    badgeBg: 'bg-white text-gray-900 border-white/80 shadow-md',
  },
};

export function KenaliSisaSection() {
  const [hoveredItem, setHoveredItem] = useState<RecyclableItem>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll reveal with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mascot eye calculation reacting toward the hovered item
  const getEyeOffset = () => {
    switch (hoveredItem) {
      case 'pet':
        return { x: -2, y: 5, tilt: -2 };
      case 'cardboard':
        return { x: 7, y: 4, tilt: 2.5 };
      case 'can':
        return { x: -8, y: 4, tilt: -3 };
      case 'paper':
        return { x: -6, y: -2, tilt: -1.5 };
      default:
        return { x: 0, y: 2, tilt: 0 };
    }
  };

  const eyeOffset = getEyeOffset();

  return (
    <section
      id="tentang"
      ref={sectionRef}
      className="relative overflow-hidden bg-functional-green py-20 md:py-28 lg:py-32 select-none w-full"
    >
      {/* Option C Combination: Seamless Diagonal Grid Pattern + Strategic Floating Watermarks */}
      <SisaSmilePatternGrid
        color="#FFFFFF"
        opacity={0.09}
        spacing={120}
        iconSize={22}
        rotate={-12}
      />
      <SisaSmileWatermark
        size={280}
        rotate={15}
        opacity={0.16}
        color="white"
        className="absolute -top-12 -right-12 z-0"
      />
      <SisaSmileWatermark
        size={210}
        rotate={-18}
        opacity={0.18}
        color="yellow"
        className="absolute -bottom-10 -left-10 z-0"
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* 50% Visual / 50% Editorial Content Composition */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Large :) Character Scene (~50% Visual Area) */}
          {/* ======================================================== */}
          <div className="relative flex items-center justify-center lg:col-span-6">
            <div className="relative w-full max-w-[500px]">
              

              {/* Dynamic Interactive Value Badge on Hover */}
              {hoveredItem && (
                <div className="absolute top-8 left-1/2 z-30 -translate-x-1/2 transition-all duration-300 ease-out transform animate-in fade-in slide-in-from-bottom-2">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 shadow-md ${ITEMS_DATA[hoveredItem].badgeBg}`}
                  >
                    <span className="flex h-2 w-2 rounded-full bg-functional-green animate-pulse" />
                    <span className="font-sans text-xs font-medium text-gray-800">
                      {ITEMS_DATA[hoveredItem].name}:
                    </span>
                    <span className="font-sans text-xs font-semibold text-functional-green">
                      {ITEMS_DATA[hoveredItem].value}
                    </span>
                  </div>
                </div>
              )}

              {/* Vector SVG Scene */}
              <svg
                viewBox="0 0 520 460"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full drop-shadow-sm"
              >
                <defs>
                  {/* Mascot Organic Gradient - lighter brand primary-green tones to stand out against functional-green background */}
                  <linearGradient id="mascotStoryGrad" x1="150" y1="110" x2="350" y2="390" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#8EF493" />
                    <stop offset="60%" stopColor="#68E36D" />
                    <stop offset="100%" stopColor="#55D15C" />
                  </linearGradient>

                  {/* Translucent PET Bottle Gradient */}
                  <linearGradient id="petStoryGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#E0F7FA" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#B2EBF2" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#80DEEA" stopOpacity="0.95" />
                  </linearGradient>

                  {/* Aluminum Can Gradient */}
                  <linearGradient id="canStoryGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#F8FAFC" />
                    <stop offset="50%" stopColor="#E2E8F0" />
                    <stop offset="100%" stopColor="#94A3B8" />
                  </linearGradient>

                  {/* Soft Realistic Contact Shadows with deeper tone for functional-green floor */}
                  <filter id="storyMascotShadow" x="-15%" y="-15%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#163A1B" floodOpacity="0.28" />
                  </filter>
                  <filter id="storyObjectShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#143418" floodOpacity="0.22" />
                  </filter>
                </defs>

                {/* Ground Ambient Contact Shadow */}
                <ellipse cx="260" cy="416" rx="200" ry="18" fill="#1B4D20" fillOpacity="0.30" />
                <ellipse cx="260" cy="416" rx="140" ry="12" fill="#143A18" fillOpacity="0.40" />

                {/* ======================================================== */}
                {/* 1. :) MASCOT (Centrepiece, Leaning Gently Forward)      */}
                {/* Timing: 0ms entrance                                     */}
                {/* ======================================================== */}
                <g
                  filter="url(#storyMascotShadow)"
                  className="transition-all duration-700 ease-out"
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed
                      ? `translate(0px, 0px) rotate(${eyeOffset.tilt}deg)`
                      : 'translate(0px, 24px) rotate(0deg)',
                    transformOrigin: '260px 380px',
                    transitionDelay: '0ms',
                  }}
                >
                  {/* Leaning Body Capsule (Expressive pose leaning slightly toward objects) */}
                  <path
                    d="M 180 205 
                       C 170 125, 340 120, 350 200 
                       C 360 295, 350 380, 260 395 
                       C 175 380, 185 295, 180 205 Z"
                    fill="url(#mascotStoryGrad)"
                  />

                  {/* Gentle Highlight Contour */}
                  <path
                    d="M 200 185 
                       C 195 145, 325 140, 335 185 
                       C 340 225, 325 270, 265 275 
                       C 205 270, 205 225, 200 185 Z"
                    fill="#FFFFFF"
                    fillOpacity="0.22"
                  />

                  {/* Warm Rosy Cheek Blush */}
                  <ellipse cx="218" cy="235" rx="13" ry="8" fill="#FF8A8A" fillOpacity="0.45" />
                  <ellipse cx="308" cy="232" rx="13" ry="8" fill="#FF8A8A" fillOpacity="0.45" />

                  {/* TWO CLEAR, VISIBLE EYES (Curious, Sophisticated, Friendly) */}
                  <g className="transition-all duration-300 ease-out">
                    {/* Left Eye */}
                    <ellipse
                      cx={230 + eyeOffset.x}
                      cy={208 + eyeOffset.y}
                      rx="9.5"
                      ry="13.5"
                      fill="#153018"
                    />
                    <circle cx={227.5 + eyeOffset.x} cy={203.5 + eyeOffset.y} r="3.8" fill="#FFFFFF" />
                    <circle cx={233 + eyeOffset.x} cy={212 + eyeOffset.y} r="1.6" fill="#FFFFFF" />

                    {/* Right Eye */}
                    <ellipse
                      cx={298 + eyeOffset.x}
                      cy={206 + eyeOffset.y}
                      rx="9.5"
                      ry="13.5"
                      fill="#153018"
                    />
                    <circle cx={295.5 + eyeOffset.x} cy={201.5 + eyeOffset.y} r="3.8" fill="#FFFFFF" />
                    <circle cx={301 + eyeOffset.x} cy={210 + eyeOffset.y} r="1.6" fill="#FFFFFF" />
                  </g>

                  {/* Warm Iconic Smile */}
                  <path
                    d="M 238 232 Q 264 260 290 230"
                    stroke="#153018"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Cute Tongue inside Smile */}
                  <path
                    d="M 256 244 C 258 253, 270 253, 272 244 Z"
                    fill="#FF6B81"
                  />

                  {/* Right Arm: Pointing & Gesturing toward Cardboard & Can */}
                  <path
                    d="M 345 255 C 375 270, 395 305, 360 335"
                    stroke="#2E7D32"
                    strokeWidth="16"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Left Arm: Gently Reaching & Interacting with the PET Bottle */}
                  <path
                    d="M 185 255 C 160 280, 175 325, 215 320"
                    stroke="#2E7D32"
                    strokeWidth="16"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>

                {/* ======================================================== */}
                {/* 2. RECYCLABLE OBJECT: PET BOTTLE (Center-Left)           */}
                {/* Timing: 200ms entrance                                   */}
                {/* ======================================================== */}
                <g
                  filter="url(#storyObjectShadow)"
                  className="cursor-pointer transition-all duration-500 ease-out"
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed
                      ? hoveredItem === 'pet'
                        ? 'translate(0px, -6px) scale(1.05)'
                        : 'translate(0px, 0px) scale(1)'
                      : 'translate(0px, 20px) scale(0.95)',
                    transformOrigin: '240px 360px',
                    transitionDelay: isRevealed ? (hoveredItem ? '0ms' : '200ms') : '200ms',
                  }}
                  onMouseEnter={() => setHoveredItem('pet')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Bottle Body */}
                  <path
                    d="M 220 315 
                       L 258 315 
                       C 264 315, 268 322, 266 342 
                       L 264 388 
                       C 262 396, 255 400, 239 400 
                       C 223 400, 216 396, 214 388 
                       L 212 342 
                       C 210 322, 214 315, 220 315 Z"
                    fill="url(#petStoryGrad)"
                    stroke="#80DEEA"
                    strokeWidth="1.8"
                  />
                  {/* Bottle Cap */}
                  <rect x="229" y="303" width="20" height="12" rx="3" fill="#00ACC1" />
                  <rect x="227" y="312" width="24" height="3" rx="1" fill="#00838F" />

                  {/* Clean Recyclable Label */}
                  <rect x="215" y="342" width="48" height="30" rx="4" fill="#FFFFFF" fillOpacity="0.95" />
                  <text x="223" y="362" fontSize="10.5" fontWeight="bold" fill="#4CAF50">
                    ♻ PET
                  </text>
                </g>

                {/* ======================================================== */}
                {/* 3. RECYCLABLE OBJECT: CARDBOARD BOX (Right Side)         */}
                {/* Timing: 350ms entrance                                   */}
                {/* ======================================================== */}
                <g
                  filter="url(#storyObjectShadow)"
                  className="cursor-pointer transition-all duration-500 ease-out"
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed
                      ? hoveredItem === 'cardboard'
                        ? 'translate(0px, -6px) scale(1.05)'
                        : 'translate(0px, 0px) scale(1)'
                      : 'translate(0px, 20px) scale(0.95)',
                    transformOrigin: '380px 365px',
                    transitionDelay: isRevealed ? (hoveredItem ? '0ms' : '350ms') : '350ms',
                  }}
                  onMouseEnter={() => setHoveredItem('cardboard')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Isometric Box Surfaces */}
                  <path d="M 340 338 L 406 312 L 442 346 L 376 372 Z" fill="#E6B17E" />
                  <path d="M 340 338 L 376 372 L 376 414 L 340 380 Z" fill="#C98B54" />
                  <path d="M 376 372 L 442 346 L 442 388 L 376 414 Z" fill="#B07542" />

                  {/* Green Eco Sealing Tape */}
                  <path d="M 370 324 L 392 315 L 400 378 L 378 387 Z" fill="#388E3C" fillOpacity="0.95" />

                  {/* Recycle Stamp on Side */}
                  <circle cx="410" cy="378" r="12" fill="#FFFFFF" fillOpacity="0.92" />
                  <text x="404" y="382" fontSize="11" fontWeight="bold" fill="#4CAF50">
                    ♻
                  </text>
                </g>

                {/* ======================================================== */}
                {/* 4. RECYCLABLE OBJECT: ALUMINIUM CAN (Far Left)           */}
                {/* Timing: 500ms entrance                                   */}
                {/* ======================================================== */}
                <g
                  filter="url(#storyObjectShadow)"
                  className="cursor-pointer transition-all duration-500 ease-out"
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed
                      ? hoveredItem === 'can'
                        ? 'translate(0px, -6px) scale(1.05)'
                        : 'translate(0px, 0px) scale(1)'
                      : 'translate(0px, 20px) scale(0.95)',
                    transformOrigin: '115px 375px',
                    transitionDelay: isRevealed ? (hoveredItem ? '0ms' : '500ms') : '500ms',
                  }}
                  onMouseEnter={() => setHoveredItem('can')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Cylindrical Aluminium Body */}
                  <rect x="92" y="342" width="46" height="68" rx="9" fill="url(#canStoryGrad)" />
                  <ellipse cx="115" cy="342" rx="23" ry="6" fill="#CBD5E1" />
                  <ellipse cx="115" cy="342" rx="16" ry="3.5" fill="#F8FAFC" />
                  <ellipse cx="115" cy="410" rx="23" ry="6" fill="#64748B" />

                  {/* Signature Yellow Band Wrap */}
                  <rect x="92" y="362" width="46" height="30" fill="#FAEF8A" fillOpacity="0.95" />
                  <circle cx="115" cy="377" r="9" fill="#4CAF50" />
                  <circle cx="112.5" cy="375.5" r="1.1" fill="#FFFFFF" />
                  <circle cx="117.5" cy="375.5" r="1.1" fill="#FFFFFF" />
                  <path d="M 111.5 379 Q 115 381.5 118.5 379" stroke="#FFFFFF" strokeWidth="1.1" strokeLinecap="round" fill="none" />
                </g>

                {/* ======================================================== */}
                {/* 5. RECYCLABLE OBJECT: PAPER SHEET (Floating Mid Left)    */}
                {/* Timing: 650ms entrance                                   */}
                {/* ======================================================== */}
                <g
                  filter="url(#storyObjectShadow)"
                  className="cursor-pointer transition-all duration-500 ease-out"
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed
                      ? hoveredItem === 'paper'
                        ? 'translate(0px, -6px) scale(1.05)'
                        : 'translate(0px, 0px) scale(1)'
                      : 'translate(0px, 20px) scale(0.95)',
                    transformOrigin: '120px 240px',
                    transitionDelay: isRevealed ? (hoveredItem ? '0ms' : '650ms') : '650ms',
                  }}
                  onMouseEnter={() => setHoveredItem('paper')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Clean Stacked Sheet with subtle rotation */}
                  <rect
                    x="96"
                    y="225"
                    width="44"
                    height="54"
                    rx="4"
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth="1.2"
                    transform="rotate(-10 96 225)"
                  />
                  {/* Editorial Text Lines on Paper */}
                  <line x1="105" y1="238" x2="128" y2="234" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" transform="rotate(-10 96 225)" />
                  <line x1="105" y1="247" x2="124" y2="243" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" transform="rotate(-10 96 225)" />
                  <line x1="105" y1="256" x2="120" y2="252" stroke="#CBD5E1" strokeWidth="2.2" strokeLinecap="round" transform="rotate(-10 96 225)" />
                  
                  {/* Mini Eco Leaf Pin on Paper */}
                  <circle cx="102" cy="226" r="3.5" fill="#4CAF50" transform="rotate(-10 96 225)" />
                </g>

                {/* Subtle Floating Sparkles */}
                <g className="animate-pulse-glow" style={{ opacity: isRevealed ? 0.8 : 0 }}>
                  <path d="M 148 112 L 151 120 L 159 123 L 151 126 L 148 134 L 145 126 L 137 123 L 145 120 Z" fill="#FAEF8A" />
                  <path d="M 388 135 L 390 141 L 396 143 L 390 145 L 388 151 L 386 145 L 380 143 L 386 141 Z" fill="#FAEF8A" />
                </g>
              </svg>

            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: 3-Step Story Flow (~50% Editorial Area)     */}
          {/* ======================================================== */}
          <div className="flex flex-col items-start text-left lg:col-span-6 lg:pl-6 w-full">
            {/* Step 0: Hero Statement */}
            <div
              className={`transition-all duration-500 ease-out motion-reduce:transform-none motion-reduce:opacity-100 ${
                isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
              style={{ transitionDelay: isRevealed ? '100ms' : '0ms' }}
            >
              {/* Section Eyebrow */}
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-smile-yellow" />
                <span className="t-eyebrow text-smile-yellow">
                  KENALI SI:)SA
                </span>
              </div>

              {/* Large Brand Philosophy Headline: unified t-h2 */}
              <h2 className="mt-4 t-h2 text-white">
                Yang tersisa bukan berarti tidak{' '}
                <span className="relative inline-block text-white font-bold">
                  bernilai
                  <svg
                    className="absolute -bottom-1 left-0 w-full h-2.5 -z-10 overflow-visible pointer-events-none"
                    viewBox="0 0 100 12"
                    preserveAspectRatio="none"
                    style={{ fill: 'none' }}
                  >
                    <path
                      d="M0 5 Q 50 12 100 5"
                      stroke="var(--smile-yellow, #FAEF8A)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>
                <span className="text-smile-yellow">.</span>
              </h2>
            </div>

            {/* Vertical Story Flow Timeline Container */}
            <div className="relative mt-8 sm:mt-10 pl-7 sm:pl-8 w-full max-w-[36em]">
              {/* Connector Line (scaleY 0 to 1 on reveal) */}
              <div
                className="absolute left-[3.5px] top-[0.65em] bottom-0 w-px bg-smile-yellow/45 origin-top transition-transform duration-700 ease-out motion-reduce:transform-none"
                style={{
                  transform: isRevealed ? 'scaleY(1)' : 'scaleY(0)',
                  transitionDelay: isRevealed ? '200ms' : '0ms',
                }}
              />

              {/* Step 1: WHY */}
              <div
                className={`relative transition-all duration-500 ease-out motion-reduce:transform-none motion-reduce:opacity-100 ${
                  isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: isRevealed ? '300ms' : '0ms' }}
              >
                {/* Node 1 — centered on label text cap-height */}
                <span className="absolute -left-7 sm:-left-8 top-[0.35em] h-2 w-2 rounded-full bg-smile-yellow" />

                {/* Label row */}
                <div className="flex items-center gap-2 leading-none">
                  <span className="font-mono font-semibold tabular-nums text-smile-yellow" style={{ fontSize: '0.8125rem' }}>01</span>
                  <span className="t-eyebrow text-white/85">WHY</span>
                </div>

                {/* Text — unified .story-text */}
                <p className="story-text mt-3">
                  <span
                    className="story-text-emph"
                    style={{
                      textDecoration: 'underline',
                      textDecorationColor: 'var(--smile-yellow)',
                      textDecorationThickness: '2px',
                      textUnderlineOffset: '4px',
                    }}
                  >
                    Indonesia punya persoalan sampah.
                  </span>{' '}
                  Banyak yang sebenarnya masih bisa didaur ulang, tapi berakhir terbuang karena tidak{' '}
                  <span className="text-smile-yellow" style={{ fontWeight: 500 }}>dipilah</span>.
                </p>
              </div>

              {/* Down-chevron between steps */}
              <div
                className={`relative my-9 transition-opacity duration-500 motion-reduce:opacity-100 ${
                  isRevealed ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: isRevealed ? '450ms' : '0ms' }}
              >
                <div className="absolute -left-[32px] sm:-left-[36px] top-0 flex items-center justify-center w-4 h-4">
                  <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className="text-smile-yellow/80">
                    <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Step 2: OUR RESPONSE */}
              <div
                className={`relative transition-all duration-500 ease-out motion-reduce:transform-none motion-reduce:opacity-100 ${
                  isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: isRevealed ? '550ms' : '0ms' }}
              >
                {/* Node 2 — centered on label text cap-height */}
                <span className="absolute -left-7 sm:-left-8 top-[0.35em] h-2 w-2 rounded-full bg-smile-yellow" />

                {/* Label row */}
                <div className="flex items-center gap-2 leading-none">
                  <span className="font-mono font-semibold tabular-nums text-smile-yellow" style={{ fontSize: '0.8125rem' }}>02</span>
                  <span className="t-eyebrow text-white/85">OUR RESPONSE</span>
                </div>

                {/* Text — unified .story-text */}
                <p className="story-text mt-3">
                  SI<span className="text-smile-yellow" style={{ fontWeight: 500 }}>:)</span>SA hadir untuk membuat sampah yang masih bernilai lebih mudah{' '}
                  <span className="text-smile-yellow" style={{ fontWeight: 500 }}>dipilah</span>,{' '}
                  <span className="text-smile-yellow" style={{ fontWeight: 500 }}>disalurkan</span>, dan{' '}
                  <span className="text-smile-yellow" style={{ fontWeight: 500 }}>dihargai</span>.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
