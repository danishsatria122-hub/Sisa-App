'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export function AboutAction() {
  const { user } = useAuth();

  const primaryHref = user
    ? user.role === 'ADMIN'
      ? '/admin/dashboard'
      : '/setoran'
    : '/register';

  return (
    <section className="bg-white overflow-hidden py-14 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">

        {/* Cozy, well-framed CTA card — eliminates empty scroll wasteland */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#F7FBF8] to-[#EFF7F1] border border-emerald-100/90 p-8 sm:p-12 text-center shadow-xs overflow-hidden">
          
          {/* Subtle decorative background glow */}
          <div
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-44 w-44 rounded-full bg-primary-green/15 blur-2xl"
            aria-hidden="true"
          />

          {/* Eyebrow indicator */}
          <div className="flex items-center justify-center gap-2 mb-6" aria-hidden="true">
            <span className="block h-px w-6 bg-emerald-200" />
            <span className="block h-2 w-2 rounded-full bg-primary-green shadow-[0_0_6px_#68E36D]" />
            <span className="block h-px w-6 bg-emerald-200" />
          </div>

          {/* Headline — exact per requirement */}
          <h2 className="font-display font-semibold text-gray-900 tracking-tight leading-[1.18] text-2xl sm:text-3xl md:text-4xl max-w-xl mx-auto">
            Give things a{' '}
            <span className="relative inline-block text-functional-green whitespace-nowrap">
              second chance.
              {/* Wavy underline */}
              <svg
                className="absolute -bottom-1 left-0 w-full text-smile-yellow"
                style={{ height: '8px' }}
                viewBox="0 0 260 10"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 5 Q65 10 130 5 T260 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            <span className="font-logo text-primary-green text-[0.9em]">:)</span>
          </h2>

          {/* Body copy (exact per requirement) */}
          <div className="mt-5 space-y-1.5 font-sans text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto">
            <p>Mari mulai memilah dari yang ada di sekitarmu hari ini.</p>
            <p className="font-medium text-gray-800">Karena yang tersisa bukan berarti tidak bernilai.</p>
          </div>

          {/* Buttons — stack on mobile, row on sm+ */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href={primaryHref}
              className="
                w-full sm:w-auto
                inline-flex items-center justify-center gap-2
                rounded-full bg-functional-green
                px-8 py-3.5
                font-sans text-sm sm:text-base font-semibold text-white
                shadow-sm
                transition-all duration-200
                hover:bg-[#3d9141] hover:shadow-md hover:-translate-y-0.5
                active:scale-[0.98]
                cursor-pointer
              "
            >
              <span>Mulai Setor</span>
              <span className="font-logo text-smile-yellow leading-none text-base" aria-hidden="true">:)</span>
            </Link>

            <Link
              href="/"
              className="
                w-full sm:w-auto
                inline-flex items-center justify-center gap-2
                rounded-full border border-gray-200 bg-white
                px-7 py-3.5
                font-sans text-sm sm:text-base font-medium text-gray-600
                shadow-2xs
                transition-all duration-200
                hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:-translate-y-0.5
                cursor-pointer
              "
            >
              <span aria-hidden="true">←</span>
              <span>Kembali ke Beranda</span>
            </Link>
          </div>

          {/* Closing brand line */}
          <p className="mt-10 font-mono text-xs text-gray-400 tracking-wider">
            SI:)SA — A little smile for things left behind.
          </p>

        </div>

      </div>
    </section>
  );
}
