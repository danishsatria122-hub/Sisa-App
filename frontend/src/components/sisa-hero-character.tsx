'use client';

import { useState } from 'react';
import { SisaSmileIcon } from './sisa-logo';

type WasteType = 'bottle' | 'cardboard' | 'can' | 'paper' | null;

export function SisaHeroCharacter() {
  const [hoveredWaste, setHoveredWaste] = useState<WasteType>(null);
  const [isMascotHovered, setIsMascotHovered] = useState(false);

  // Exact brand value badge copy per design specifications
  const wasteValues: Record<string, { label: string; value: string; category: string }> = {
    bottle: { label: 'Plastik PET', value: '+150 :) / kg', category: 'Botol & Galon Bersih' },
    cardboard: { label: 'Kardus & Karton', value: '+120 :) / kg', category: 'Kering & Terlipat Rapi' },
    can: { label: 'Alumunium', value: '+200 :) / kg', category: 'Kaleng Minuman & Makanan' },
    paper: { label: 'Kertas & Majalah', value: '+90 :) / kg', category: 'HVS & Koran Bekas' },
  };

  // Calculate eye look offset based on which recyclable item is hovered
  const getEyeOffset = () => {
    switch (hoveredWaste) {
      case 'can':
        return { x: -6, y: 2, tilt: -2 }; // Look down-left towards can
      case 'cardboard':
        return { x: 7, y: 3, tilt: 2.5 }; // Look down-right towards cardboard
      case 'paper':
        return { x: -6, y: -4, tilt: -1.5 }; // Look up-left towards paper plane
      case 'bottle':
        return { x: 0, y: 3, tilt: 0 }; // Look directly at bottle
      default:
        return { x: 0, y: 0, tilt: 0 };
    }
  };

  const eyeOffset = getEyeOffset();

  return (
    <div
      className="relative flex w-full items-center justify-center select-none py-2 lg:py-0"
      onMouseLeave={() => {
        setHoveredWaste(null);
        setIsMascotHovered(false);
      }}
    >
      {/* Background Soft Organic Lighting - Low opacity, cohesive with SI:)SA green/yellow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-green/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/4 right-8 -z-10 h-[240px] w-[240px] rounded-full bg-smile-yellow/25 blur-2xl" />

      {/* Main Illustration Wrapper - Allows expressive scale on desktop while respecting page bounds */}
      <div className="relative w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[560px] xl:max-w-[600px] transition-transform duration-500">
        
        {/* Floating Micro Detail 1: Interactive / Active Value Badge */}
        <div
          className={`absolute -top-2 left-1/2 z-30 -translate-x-1/2 transition-all duration-300 ease-out transform ${
            hoveredWaste
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-1 pointer-events-none scale-95'
          }`}
        >
          {hoveredWaste && (
            <div className="flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 shadow-sm text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-functional-green shrink-0 animate-pulse" />
              <span className="font-sans font-medium text-gray-700">
                {wasteValues[hoveredWaste].label}
              </span>
              <span className="font-sans font-semibold text-functional-green bg-green-50 px-2 py-0.5 rounded-full">
                {wasteValues[hoveredWaste].value}
              </span>
            </div>
          )}
        </div>

        {/* Vector SVG Composition */}
        <svg
          viewBox="0 0 500 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full drop-shadow-xl transition-transform duration-500 ease-out"
        >
          <defs>
            {/* Soft Mascot Gradient */}
            <linearGradient id="sisaMascotGrad" x1="120" y1="120" x2="340" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--primary-green, #68E36D)" />
              <stop offset="50%" stopColor="var(--functional-green, #4CAF50)" />
              <stop offset="100%" stopColor="#388E3C" />
            </linearGradient>

            {/* Translucent PET Bottle Gradient */}
            <linearGradient id="petBottleGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E0F7FA" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#B2EBF2" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#80DEEA" stopOpacity="0.95" />
            </linearGradient>

            {/* Cardboard Box Gradient */}
            <linearGradient id="cardboardGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5D0A9" />
              <stop offset="100%" stopColor="#D4955B" />
            </linearGradient>

            {/* Aluminum Can Gradient */}
            <linearGradient id="aluCanGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="40%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Soft Drop Shadows */}
            <filter id="mascotShadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#1C4B23" floodOpacity="0.12" />
            </filter>
            <filter id="objectShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0F2914" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Ground Floor Ambient Shadow */}
          <ellipse cx="250" cy="432" rx="190" ry="22" fill="#000000" fillOpacity="0.05" />
          <ellipse cx="250" cy="432" rx="135" ry="14" fill="#4CAF50" fillOpacity="0.07" />

          {/* ============================================================ */}
          {/* 1. CARDBOARD BOX (Right Side Recyclable Object)               */}
          {/* ============================================================ */}
          <g
            className="cursor-pointer transition-all duration-300 ease-out"
            style={{
              transform: hoveredWaste === 'cardboard' ? 'translateY(-6px) scale(1.04)' : 'translateY(0px) scale(1)',
              transformOrigin: '390px 360px',
            }}
            onMouseEnter={() => setHoveredWaste('cardboard')}
            onMouseLeave={() => setHoveredWaste(null)}
            filter="url(#objectShadow)"
          >
            {/* Box Surfaces (Clean isometric craft cardboard) */}
            <path d="M 335 332 L 415 302 L 455 342 L 375 372 Z" fill="#E6B17E" />
            <path d="M 335 332 L 375 372 L 375 422 L 335 382 Z" fill="#C98B54" />
            <path d="M 375 372 L 455 342 L 455 392 L 375 422 Z" fill="#B07542" />

            {/* Green Eco Sealing Tape */}
            <path d="M 370 316 L 395 306 L 404 380 L 379 390 Z" fill="#4CAF50" fillOpacity="0.9" />
            {/* Recycle Symbol Stamp */}
            <circle cx="415" cy="382" r="14" fill="#FFFFFF" fillOpacity="0.92" />
            <text x="408" y="386" fontSize="12" fontWeight="bold" fill="#4CAF50">♻</text>
          </g>

          {/* ============================================================ */}
          {/* 2. ALUMINIUM SODA CAN (Left Side Recyclable Object)           */}
          {/* ============================================================ */}
          <g
            className="cursor-pointer transition-all duration-300 ease-out"
            style={{
              transform: hoveredWaste === 'can' ? 'translateY(-6px) scale(1.05)' : 'translateY(0px) scale(1)',
              transformOrigin: '100px 375px',
            }}
            onMouseEnter={() => setHoveredWaste('can')}
            onMouseLeave={() => setHoveredWaste(null)}
            filter="url(#objectShadow)"
          >
            {/* Can Cylindrical Body */}
            <rect x="75" y="340" width="50" height="76" rx="10" fill="url(#aluCanGrad)" />
            <ellipse cx="100" cy="340" rx="25" ry="7" fill="#CBD5E1" />
            <ellipse cx="100" cy="340" rx="18" ry="4" fill="#F8FAFC" />
            <ellipse cx="100" cy="416" rx="25" ry="7" fill="#64748B" />

            {/* Brand Signature Label Wrap */}
            <rect x="75" y="362" width="50" height="34" fill="#FAEF8A" fillOpacity="0.95" />
            <circle cx="100" cy="379" r="10" fill="#4CAF50" />
            {/* Mini Smile mark inside can emblem */}
            <circle cx="97" cy="377" r="1.2" fill="#FFFFFF" />
            <circle cx="103" cy="377" r="1.2" fill="#FFFFFF" />
            <path d="M 96 381 Q 100 384 104 381" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </g>

          {/* ============================================================ */}
          {/* 3. RECYCLABLE PAPER SHEETS & ORIGAMI (Floating Top Left)      */}
          {/* ============================================================ */}
          <g
            className="cursor-pointer transition-all duration-300 ease-out"
            style={{
              transform: hoveredWaste === 'paper' ? 'translateY(-6px) scale(1.06)' : 'translateY(0px) scale(1)',
              transformOrigin: '90px 160px',
            }}
            onMouseEnter={() => setHoveredWaste('paper')}
            onMouseLeave={() => setHoveredWaste(null)}
          >
            {/* Clean White Paper Sheet */}
            <rect
              x="55"
              y="180"
              width="48"
              height="60"
              rx="5"
              fill="#FFFFFF"
              transform="rotate(-12 55 180)"
              filter="url(#objectShadow)"
            />
            <line x1="66" y1="195" x2="90" y2="190" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" transform="rotate(-12 55 180)" />
            <line x1="66" y1="205" x2="85" y2="200" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" transform="rotate(-12 55 180)" />

            {/* Crisp Paper Airplane */}
            <path d="M 120 130 L 165 145 L 135 160 Z" fill="#E2E8F0" filter="url(#objectShadow)" />
            <path d="M 135 160 L 165 145 L 130 155 Z" fill="#CBD5E1" />
          </g>

          {/* ============================================================ */}
          {/* 4. THE :) MASCOT CHARACTER (Center Focal Point)              */}
          {/* ============================================================ */}
          <g
            filter="url(#mascotShadow)"
            className="cursor-pointer transition-transform duration-300 ease-out motion-safe:animate-breathe"
            style={{
              transform: `rotate(${eyeOffset.tilt}deg)`,
              transformOrigin: '250px 380px',
            }}
            onMouseEnter={() => setIsMascotHovered(true)}
          >
            {/* Character Base Body (Soft, organic, rounded capsule) */}
            <path
              d="M 160 220 
                 C 160 140, 340 140, 340 220 
                 C 340 310, 340 380, 250 395 
                 C 160 380, 160 310, 160 220 Z"
              fill="url(#sisaMascotGrad)"
            />

            {/* Subtle Inner Body Highlight Glow */}
            <path
              d="M 180 200 
                 C 180 160, 320 160, 320 200 
                 C 320 240, 310 280, 250 285 
                 C 190 280, 180 240, 180 200 Z"
              fill="#FFFFFF"
              fillOpacity="0.16"
            />

            {/* Cheerful Cheek Blush */}
            <ellipse cx="205" cy="245" rx="13" ry="8" fill="#FF8A8A" fillOpacity="0.45" />
            <ellipse cx="295" cy="245" rx="13" ry="8" fill="#FF8A8A" fillOpacity="0.45" />

            {/* TWO CLEAR, VISIBLE EYES (Reactive tracking of hovered items) */}
            {isMascotHovered && hoveredWaste === 'bottle' ? (
              // Joyful Winking Eyes when hugging bottle directly
              <g>
                <path d="M 205 218 Q 215 208 225 218" stroke="#16331A" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                <path d="M 275 218 Q 285 208 295 218" stroke="#16331A" strokeWidth="5.5" strokeLinecap="round" fill="none" />
              </g>
            ) : (
              // Clear, Shiny Expressive Eyes looking toward hovered items
              <g className="transition-all duration-300 ease-out">
                {/* Left Eye */}
                <ellipse
                  cx={215 + eyeOffset.x}
                  cy={218 + eyeOffset.y}
                  rx="10"
                  ry="14"
                  fill="#153018"
                />
                <circle cx={212 + eyeOffset.x} cy={213 + eyeOffset.y} r="4" fill="#FFFFFF" />
                <circle cx={218 + eyeOffset.x} cy={222 + eyeOffset.y} r="1.8" fill="#FFFFFF" />

                {/* Right Eye */}
                <ellipse
                  cx={285 + eyeOffset.x}
                  cy={218 + eyeOffset.y}
                  rx="10"
                  ry="14"
                  fill="#153018"
                />
                <circle cx={282 + eyeOffset.x} cy={213 + eyeOffset.y} r="4" fill="#FFFFFF" />
                <circle cx={288 + eyeOffset.x} cy={222 + eyeOffset.y} r="1.8" fill="#FFFFFF" />
              </g>
            )}

            {/* Friendly Warm Smile (Signature :) Smile) */}
            <path
              d="M 225 242 Q 250 272 275 242"
              stroke="#153018"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />

            {/* Playful Tongue Inside Smile */}
            <path
              d="M 240 255 C 243 266, 257 266, 260 255 Z"
              fill="#FF6B81"
            />

            {/* Arms Subtly Hugging / Touching the PET Bottle */}
            {/* Left Arm */}
            <path
              d="M 170 270 C 142 290, 160 330, 202 325"
              stroke="#3EA745"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Arm */}
            <path
              d="M 330 270 C 358 290, 340 335, 288 330"
              stroke="#3EA745"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* ============================================================ */}
          {/* 5. RECYCLABLE PET BOTTLE (Held in the center)                 */}
          {/* ============================================================ */}
          <g
            className="cursor-pointer transition-all duration-300 ease-out"
            style={{
              transform: hoveredWaste === 'bottle' ? 'translateY(-4px) scale(1.04)' : 'translateY(0px) scale(1)',
              transformOrigin: '250px 355px',
            }}
            onMouseEnter={() => setHoveredWaste('bottle')}
            onMouseLeave={() => setHoveredWaste(null)}
            filter="url(#objectShadow)"
          >
            {/* Translucent Bottle Contour */}
            <path
              d="M 228 310 
                 L 272 310 
                 C 278 310, 282 318, 280 340 
                 L 278 395 
                 C 276 405, 268 410, 250 410 
                 C 232 410, 224 405, 222 395 
                 L 220 340 
                 C 218 318, 222 310, 228 310 Z"
              fill="url(#petBottleGrad)"
              stroke="#80DEEA"
              strokeWidth="2"
            />
            {/* Cap */}
            <rect x="238" y="296" width="24" height="14" rx="3" fill="#00ACC1" />
            <rect x="236" y="307" width="28" height="4" rx="1" fill="#00838F" />

            {/* Recyclable PET Label */}
            <rect x="222" y="340" width="56" height="36" rx="4" fill="#FFFFFF" fillOpacity="0.94" />
            <text x="231" y="364" fontSize="12" fontWeight="bold" fill="#4CAF50">♻ PET</text>
          </g>

          {/* Decorative Floating Sparkle & Leaf Particles */}
          <g className="animate-pulse-glow">
            <path d="M 110 90 L 114 102 L 126 106 L 114 110 L 110 122 L 106 110 L 94 106 L 106 102 Z" fill="#FAEF8A" />
          </g>
          <g className="animate-float-slow">
            <path d="M 390 110 L 393 118 L 401 121 L 393 124 L 390 132 L 387 124 L 379 121 L 387 118 Z" fill="#68E36D" />
          </g>
          <g className="animate-float-reverse">
            <path d="M 362 208 Q 382 198 392 218 Q 372 228 362 208 Z" fill="#AFD794" />
          </g>
        </svg>



      </div>
    </div>
  );
}
