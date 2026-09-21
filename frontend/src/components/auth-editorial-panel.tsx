'use client';

import Link from 'next/link';
import { SisaLogo } from './sisa-logo';

interface AuthEditorialPanelProps {
  mode?: 'register' | 'login';
}

export function AuthEditorialPanel({ mode = 'register' }: AuthEditorialPanelProps) {
  return (
    <section
      aria-label="Cerita SI:)SA"
      className="relative flex flex-col justify-between bg-functional-green px-8 py-10 sm:px-12 sm:py-12 lg:p-14 xl:p-16 text-white select-none overflow-hidden min-h-full"
    >
      {/* ── TOP: Brand Identity & Quiet Home Navigation ── */}
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="inline-block transition hover:opacity-90">
          <SisaLogo variant="white" height={36} />
        </Link>
        <Link
          href="/"
          className="text-xs font-normal text-white/75 hover:text-white transition-colors inline-flex items-center gap-1.5 tracking-wide"
        >
          <span>←</span>
          <span>Beranda</span>
        </Link>
      </div>

      {/* ── CENTER: Art-Directed Editorial Composition ── */}
      <div className="relative z-10 my-8 sm:my-auto max-w-lg">
        {/* Eyebrow */}
        <p className="font-sans text-[11px] font-semibold tracking-[0.2em] text-smile-yellow uppercase">
          SI:)SA
        </p>

        {/* Large Editorial Headline: Measured weight, tight leading, deliberate phrasing */}
        <h1 className="mt-3.5 font-sans text-3xl sm:text-4xl xl:text-[44px] font-normal tracking-tight text-white leading-[1.14]">
          Wait...<br />
          I still have<br />
          <span className="font-medium text-smile-yellow">something to give</span>.
        </h1>

        {/* Supporting Thought */}
        <p className="mt-4 font-sans text-base sm:text-lg font-normal text-green-50/85 leading-relaxed max-w-sm">
          {mode === 'register'
            ? 'Maybe yours do too.'
            : 'Selamat datang kembali. Mari lanjutkan kebaikan yang tersisa.'}
        </p>

        {/* ── VISUAL SCENE: Typography & Illustration Interacting ── */}
        {/* The PET bottle (the discarded thing) meets :) (who discovers its value) */}
        <div className="mt-8 sm:mt-10 relative flex items-center justify-center">
          <svg
            viewBox="0 0 420 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[380px] drop-shadow-sm"
          >
            <defs>
              {/* Mascot Brand Gradient */}
              <linearGradient id="editorialMascotGrad" x1="120" y1="50" x2="260" y2="250" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8EF493" />
                <stop offset="55%" stopColor="#68E36D" />
                <stop offset="100%" stopColor="#55D15C" />
              </linearGradient>

              {/* Translucent PET Bottle Gradient */}
              <linearGradient id="editorialBottleGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E0F7FA" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#B2EBF2" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#80DEEA" stopOpacity="0.95" />
              </linearGradient>

              {/* Natural Floor Ambient Shadow */}
              <filter id="editorialShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#143A18" floodOpacity="0.22" />
              </filter>
            </defs>

            {/* Subtle connecting visual arc from headline direction down to bottle */}
            <path
              d="M 40 20 C 40 80, 100 110, 160 125"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              strokeDasharray="3 4"
              fill="none"
            />

            {/* Ground Shadow */}
            <ellipse cx="210" cy="258" rx="160" ry="12" fill="#143A18" fillOpacity="0.22" />
            <ellipse cx="288" cy="259" rx="32" ry="6" fill="#0D2610" fillOpacity="0.26" />

            {/* 1. The :) Character: Leaning forward in quiet discovery */}
            <g filter="url(#editorialShadow)">
              {/* Organic Body Capsule */}
              <path
                d="M 125 125
                   C 120 65, 255 60, 265 122
                   C 275 190, 262 250, 195 256
                   C 130 250, 134 190, 125 125 Z"
                fill="url(#editorialMascotGrad)"
              />

              {/* Light Highlight Contour */}
              <path
                d="M 140 110
                   C 135 80, 238 78, 248 110
                   C 252 142, 242 180, 195 182
                   C 148 180, 148 142, 140 110 Z"
                fill="#FFFFFF"
                fillOpacity="0.20"
              />

              {/* Soft Warm Blush */}
              <ellipse cx="155" cy="148" rx="9" ry="5.5" fill="#FF8A8A" fillOpacity="0.45" />
              <ellipse cx="222" cy="144" rx="9" ry="5.5" fill="#FF8A8A" fillOpacity="0.45" />

              {/* Curious Eyes: Looking toward the PET bottle */}
              {/* Left Eye */}
              <ellipse cx="166" cy="128" rx="7" ry="10.5" fill="#153018" />
              <circle cx="168.5" cy="130" r="2.8" fill="#FFFFFF" />

              {/* Right Eye */}
              <ellipse cx="214" cy="125" rx="7" ry="10.5" fill="#153018" />
              <circle cx="216.5" cy="127" r="2.8" fill="#FFFFFF" />

              {/* Warm Gentle Smile :) */}
              <path
                d="M 176 148 Q 192 166 208 147"
                stroke="#153018"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />

              {/* Arm: Gently Touching and Reaching for the Bottle */}
              <path
                d="M 194 168 C 210 180, 245 200, 268 194"
                stroke="#2E7D32"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* 2. The Recyclable PET Bottle: The Found Treasure */}
            <g className="transition-transform duration-300 hover:-translate-y-1">
              {/* Bottle Body */}
              <path
                d="M 272 184
                   L 302 184
                   C 307 184, 310 190, 308 206
                   L 305 244
                   C 303 251, 296 255, 286 255
                   C 276 255, 270 251, 268 244
                   L 265 206
                   C 263 190, 267 184, 272 184 Z"
                fill="url(#editorialBottleGrad)"
                stroke="#80DEEA"
                strokeWidth="1.5"
              />
              {/* Bottle Cap */}
              <rect x="280" y="174" width="14" height="10" rx="2" fill="#00ACC1" />
              <rect x="278" y="182" width="18" height="2.5" rx="0.8" fill="#00838F" />

              {/* Minimalist Recycle Stamp Label */}
              <rect x="269" y="206" width="36" height="23" rx="3" fill="#FFFFFF" fillOpacity="0.95" />
              <text x="274" y="222" fontSize="9" fontWeight="bold" fill="#4CAF50">
                ♻ PET
              </text>
            </g>

            {/* 3. Editorial Annotation Detail: Subtle pointer and text */}
            <g opacity="0.75">
              <text x="324" y="196" fontSize="9" fill="#FFFFFF" fontFamily="sans-serif" letterSpacing="0.05em">
                masih bernilai :)
              </text>
              <line x1="316" y1="193" x2="304" y2="198" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
            </g>
          </svg>
        </div>

        {/* Small Poetic Closing Line */}
        <p className="mt-4 text-center text-xs font-normal text-white/75 italic tracking-wide">
          Give things a second chance :)
        </p>
      </div>

      {/* ── BOTTOM: Quiet, Minimalist Statement ── */}
      <div className="relative z-10 pt-4 border-t border-white/15 text-[11px] text-white/60 flex items-center justify-between tracking-wide">
        <span>Yang tersisa bukan berarti tidak bernilai.</span>
        <span>© 2026 SI:)SA</span>
      </div>
    </section>
  );
}
