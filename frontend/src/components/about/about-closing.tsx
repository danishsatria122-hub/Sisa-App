'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SisaSmileIcon } from '@/components/sisa-logo';

export function AboutClosing() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-[#FAFAF8] py-24 sm:py-32 lg:py-36">
      {/* Background brand green bloom */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary-green/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 text-center">
        
        {/* Oversized Brand Smile */}
        <div className="flex items-center justify-center mb-8">
          <SisaSmileIcon size={56} color="var(--primary-green, #68E36D)" />
        </div>

        {/* Poetic Closing Headline — Large & Creative */}
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-medium text-gray-900 tracking-tight leading-[1.2] max-w-3xl mx-auto">
          Give things a{' '}
          <span className="relative inline-block text-functional-green">
            second chance.
            <svg
              className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2.5 sm:h-3 text-smile-yellow"
              viewBox="0 0 280 10"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0 5 Q70 10 140 5 T280 5"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>{' '}
          <span className="text-primary-green">:)</span>
        </h2>

        {/* Quiet Closing Supporting Copy */}
        <p className="mt-7 font-sans text-base sm:text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
          Mari mulai memilah dari yang ada di sekitarmu hari ini. Karena yang tersisa bukan berarti tidak bernilai.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={user ? (user.role === 'ADMIN' ? '/admin/dashboard' : '/setoran') : '/register'}
            className="group inline-flex items-center gap-2.5 rounded-full bg-functional-green px-7 py-3.5 text-sm sm:text-base font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#3d9141] hover:shadow-md active:scale-[0.98]"
          >
            <span>Mulai Setor</span>
            <SisaSmileIcon
              size={18}
              color="var(--smile-yellow, #FAEF8A)"
              className="transition-transform group-hover:rotate-12"
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3.5 text-sm sm:text-base font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-900 hover:bg-white"
          >
            <span>←</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Brand mini tagline */}
        <p className="mt-12 font-mono text-xs text-gray-400 tracking-wider">
          SI:)SA — A little smile for things left behind.
        </p>

      </div>
    </section>
  );
}
