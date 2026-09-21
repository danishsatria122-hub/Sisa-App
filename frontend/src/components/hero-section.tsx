'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SisaSmileIcon } from './sisa-logo';
import { SisaHeroCharacter } from './sisa-hero-character';

export function HeroSection() {
  const { user } = useAuth();

  const handleScrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('tentang');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-white pt-6 sm:pt-10 lg:pt-14 pb-[clamp(40px,5vw,64px)]">
      {/* Editorial Background: Subtle architectural lines & soft localized light */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {/* Soft, low-opacity localized tint on the right side */}
        <div className="absolute top-[-5%] right-[-5%] h-[550px] w-[550px] rounded-full bg-primary-green/[0.04] blur-3xl" />
        <div className="absolute top-[25%] right-[10%] h-[350px] w-[350px] rounded-full bg-smile-yellow/[0.06] blur-2xl" />
        
        {/* Whisper-quiet geometric guide lines for editorial precision */}
        <svg
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-[0.035]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <line x1="12%" y1="0" x2="12%" y2="100%" stroke="#16331A" strokeWidth="1" strokeDasharray="4 8" />
          <line x1="58%" y1="0" x2="58%" y2="100%" stroke="#16331A" strokeWidth="1" strokeDasharray="4 8" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric Editorial Composition */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-6 xl:gap-8">
          
          {/* LEFT: Typography, Narrative & Actions (~58% visual area on desktop) */}
          <div className="flex flex-col items-start text-left lg:col-span-7 xl:col-span-7 z-10">
            
            {/* 1. Dominant Editorial Headline with unified t-display role */}
            <h1 className="t-display text-gray-900">
              <span className="block font-normal text-gray-700 tracking-normal mb-1.5" style={{ fontSize: '0.52em' }}>
                A little
              </span>
              <span>
                <span className="relative inline-block text-functional-green mr-2 sm:mr-3">
                  smile
                  {/* Refined smile curve accent */}
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-3 -z-10 overflow-visible pointer-events-none"
                    viewBox="0 0 100 12"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M 2 4 Q 50 12 98 4"
                      stroke="var(--smile-yellow, #FAEF8A)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>
                <span className="text-gray-800">for things</span>
              </span>
              <span className="block text-gray-900 mt-1">
                left behind<span className="text-functional-green">.</span>
              </span>
            </h1>

            {/* 2. Supporting Quote: Unified t-lead role */}
            <p className="mt-7 t-lead">
              “Yang tersisa bukan berarti tidak bernilai.”
            </p>

            {/* 3. Description: Unified t-body role */}
            <p className="mt-3 t-body">
              SI<span className="font-normal text-functional-green">:)</span>SA membantu kamu mengubah sampah daur ulang menjadi poin bernilai, hadiah bermanfaat, dan dampak nyata bagi bumi.
            </p>

            {/* 4. Action Buttons: Unified t-label role */}
            <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-5">
              {/* Primary Action: Mulai Setor */}
              <Link
                href={user ? (user.role === 'ADMIN' ? '/admin/setoran' : '/setoran') : '/register'}
                className="group inline-flex h-[52px] items-center gap-2.5 rounded-full bg-functional-green px-[28px] t-label text-white shadow-sm transition-all duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] hover:-translate-y-0.5 hover:bg-[#388E3C] hover:shadow-[0_8px_20px_-6px_rgba(56,142,60,0.25)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-functional-green focus-visible:outline-offset-[3px] motion-reduce:transform-none motion-reduce:transition-colors shrink-0 select-none"
              >
                <span>Mulai Setor</span>
                <SisaSmileIcon
                  size={18}
                  color="var(--smile-yellow, #FAEF8A)"
                  className="transition-transform duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-[2px] motion-reduce:transform-none"
                />
              </Link>

              {/* Secondary Action: Kenali SI:)SA */}
              <a
                href="#tentang"
                onClick={handleScrollToFeatures}
                className="group inline-flex h-[52px] items-center gap-2 rounded-full border border-gray-200 px-[26px] t-label text-gray-800 transition-all duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] hover:-translate-y-0.5 hover:border-functional-green/30 hover:bg-functional-green/[0.08] hover:text-gray-900 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-functional-green focus-visible:outline-offset-[3px] motion-reduce:transform-none motion-reduce:transition-colors shrink-0 select-none"
              >
                <span>Kenali SI:)SA</span>
                <span
                  className="inline-block text-gray-500 transition-transform duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-hover:translate-y-[3px] group-hover:text-functional-green motion-reduce:transform-none"
                  aria-hidden="true"
                >
                  ↓
                </span>
              </a>
            </div>

          </div>

          {/* RIGHT: Character Scene extending naturally beyond the boundary (~42% desktop area) */}
          <div className="relative flex items-center justify-center lg:justify-end lg:col-span-5 lg:-mr-4 xl:-mr-8">
            <SisaHeroCharacter />
          </div>

        </div>

        {/* Editorial Impact Strip - Compact 4-column grouping aligned to hero left edge */}
        <div className="mt-[clamp(24px,3vw,40px)] border-t border-gray-100 pt-[clamp(24px,3vw,32px)]">
          <div className="max-w-[1100px] grid grid-cols-2 gap-x-6 gap-y-5 sm:gap-x-8 sm:gap-y-6 lg:grid-cols-4 lg:gap-x-[clamp(24px,3vw,48px)] items-baseline">
            
            {/* Stat 1: Sampah tersalurkan */}
            <div className="space-y-[6px]">
              <div className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 leading-none">
                1,250<span className="text-functional-green text-2xl sm:text-3xl font-medium">+</span>
                <span className="ml-1 text-xs sm:text-sm font-normal text-gray-400">KG</span>
              </div>
              <p className="font-sans text-xs text-gray-500">
                Sampah tersalurkan
              </p>
            </div>

            {/* Stat 2: Setoran tercatat */}
            <div className="space-y-[6px]">
              <div className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-gray-800 leading-none">
                100<span className="text-gray-400 text-2xl font-light">%</span>
              </div>
              <p className="font-sans text-xs text-gray-500">
                Setoran tercatat
              </p>
            </div>

            {/* Stat 3: Kategori sampah */}
            <div className="space-y-[6px]">
              <div className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-functional-green leading-none">
                4
              </div>
              <p className="font-sans text-xs text-gray-500">
                Kategori sampah
              </p>
            </div>

            {/* Stat 4: Storytelling brand touch */}
            <div className="space-y-[6px]">
              <div className="flex items-center gap-1.5 text-gray-800 leading-none">
                <SisaSmileIcon size={20} color="var(--functional-green, #4CAF50)" />
                <span className="font-sans text-sm font-medium text-gray-800">
                  Bernilai
                </span>
              </div>
              <p className="font-sans text-xs text-gray-500">
                Setiap setoran punya arti
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
