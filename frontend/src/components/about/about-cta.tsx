'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { SisaSmileWatermark } from '@/components/sisa-smile-watermark';
import { useAuth } from '@/lib/auth-context';

export function AboutCta() {
  const { user } = useAuth();
  const [ctaInView, setCtaInView] = useState(false);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  const primaryHref = user
    ? user.role === 'ADMIN'
      ? '/admin/dashboard'
      : '/setoran'
    : '/register';

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCtaInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCtaInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative z-0 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full"
      style={{
        paddingTop:    'clamp(32px, 4vh, 48px)',
        paddingBottom: 'clamp(40px, 6vh, 64px)',
      }}
      aria-label="Call to Action"
    >
      <div
        ref={ctaRef}
        className="relative rounded-3xl bg-functional-green text-white overflow-hidden"
        style={{
          padding: 'clamp(32px, 4.5vw, 56px)',
          boxShadow: '0 12px 28px -16px rgba(30, 58, 32, 0.30)',
        }}
      >
        {/* Subtle ambient blur */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-80 w-80 rounded-full bg-white/20 blur-xl pointer-events-none" />

        {/* Brand Smile Watermark */}
        <SisaSmileWatermark
          size={360}
          rotate={18}
          opacity={0.26}
          color="yellow"
          className="absolute -right-12 -bottom-16 z-0 pointer-events-none"
        />

        <div className="relative z-10 max-w-2xl">
          {/* Eyebrow */}
          <span
            className={`inline-block t-eyebrow text-smile-yellow ${
              ctaInView ? 'cta-anim-eyebrow' : 'opacity-0 motion-reduce:opacity-100'
            }`}
          >
            :) READY WHEN YOU ARE
          </span>

          {/* Headline */}
          <h2
            className={`mt-2 font-display text-white ${
              ctaInView ? 'cta-anim-headline' : 'opacity-0 motion-reduce:opacity-100'
            }`}
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              textWrap: 'balance',
              maxWidth: '16em',
            }}
          >
            Give things a second chance. :)
          </h2>

          {/* Body */}
          <p
            className={`text-white/95 ${
              ctaInView ? 'cta-anim-paragraph' : 'opacity-0 motion-reduce:opacity-100'
            }`}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.3vw, 1.125rem)',
              fontWeight: 400,
              lineHeight: 1.65,
              maxWidth: '34em',
              marginTop: '16px',
            }}
          >
            Mulai dari satu benda yang ada di sekitarmu.
          </p>

          {/* Buttons */}
          <div
            className={`mt-8 flex flex-col min-[480px]:flex-row min-[480px]:items-center gap-3 ${
              ctaInView ? 'cta-anim-buttons' : 'opacity-0 motion-reduce:opacity-100'
            }`}
          >
            <Link
              href={primaryHref}
              className="inline-flex h-[52px] w-full min-[480px]:w-auto items-center justify-center rounded-full bg-white px-7 font-sans text-base font-semibold text-functional-green transition-all duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-4px_rgba(30,58,32,0.25)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px] motion-reduce:transform-none motion-reduce:transition-colors shrink-0 select-none"
            >
              Mulai Setor :)
            </Link>
            <Link
              href="/"
              className="inline-flex h-[52px] w-full min-[480px]:w-auto items-center justify-center rounded-full border border-white/70 bg-transparent px-7 font-sans text-base font-semibold text-white transition-all duration-200 hover:bg-white/[0.14] hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px] motion-reduce:transform-none motion-reduce:transition-colors shrink-0 select-none"
            >
              ← Kembali ke Beranda
            </Link>
          </div>

          {/* Closing Line */}
          <p className="mt-8 font-sans text-xs text-white/85 font-normal tracking-wide">
            SI:)SA — A little smile for things left behind.
          </p>
        </div>
      </div>
    </section>
  );
}
