'use client';

import { useEffect, useState } from 'react';

export function AboutOpening({
  'data-align': dataAlign = 'right',
}: {
  'data-align'?: 'right' | 'left' | 'center';
}) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setAnimated(true);
      return;
    }
    const timer = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const isRight = dataAlign === 'right';
  const isLeft = dataAlign === 'left';
  const isCenter = dataAlign === 'center';

  return (
    <section
      data-align={dataAlign}
      className="relative w-full bg-[#FAFBF9] border-b border-gray-100/80 overflow-visible flex items-center justify-center"
      style={{
        minHeight: 'clamp(320px, 44svh, 400px)',
        paddingTop: 'clamp(32px, 4vh, 48px)',
        paddingBottom: 'clamp(32px, 4vh, 48px)',
      }}
      aria-label="About SI:)SA opening"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1120px] px-6 sm:px-8">
        <div
          className="flex min-h-[clamp(240px,28svh,320px)] flex-col justify-center"
          style={{
            alignItems: isCenter ? 'center' : isLeft ? 'flex-start' : 'flex-end',
            textAlign: isCenter ? 'center' : isLeft ? 'left' : 'right',
            marginLeft: isCenter ? 'auto' : isLeft ? '0' : 'auto',
            marginRight: isCenter ? 'auto' : isLeft ? '0' : '0',
          }}
        >
          <div
            className="inline-flex items-center gap-2 mb-3"
            style={{
              opacity: animated ? 1 : 0,
              transform: animated ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)',
              flexDirection: isRight ? 'row' : isLeft ? 'row' : 'row',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-functional-green shrink-0" aria-hidden="true" style={{ order: isRight ? 2 : 1 }} />
            <span className="t-eyebrow text-functional-green select-none" style={{ order: isRight ? 1 : 2 }}>ABOUT SI:)SA</span>
          </div>

          <h1
            className="font-display font-bold text-gray-900 [text-wrap:balance]"
            style={{
              fontSize: 'clamp(1.875rem, 3.6vw, 2.75rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              maxWidth: isCenter ? '22em' : '18em',
              marginLeft: isCenter ? 'auto' : isRight ? 'auto' : 0,
              marginRight: isCenter ? 'auto' : isRight ? 0 : 'auto',
              opacity: animated ? 1 : 0,
              transform: animated ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 600ms cubic-bezier(0.16,1,0.3,1) 100ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 100ms',
            }}
          >
            Kami percaya, sesuatu yang dianggap selesai{' '}
            <span className="text-functional-green whitespace-nowrap">
              belum tentu
            </span>{' '}
            kehilangan nilainya.
          </h1>

          <p
            className="font-sans font-light text-slate-600 leading-[1.65] [text-wrap:balance]"
            style={{
              fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
              maxWidth: '30em',
              marginTop: '16px',
              marginLeft: isCenter ? 'auto' : isRight ? 'auto' : 0,
              marginRight: isCenter ? 'auto' : isRight ? 0 : 'auto',
              textAlign: isCenter ? 'center' : isLeft ? 'left' : 'right',
              opacity: animated ? 1 : 0,
              transform: animated ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 600ms cubic-bezier(0.16,1,0.3,1) 220ms, transform 600ms cubic-bezier(0.16,1,0.3,1) 220ms',
            }}
          >
            SI:)SA lahir dari sebuah cara pandang sederhana: memberi kesempatan kedua pada sesuatu yang masih memiliki nilai.
          </p>
        </div>
      </div>
    </section>
  );
}
