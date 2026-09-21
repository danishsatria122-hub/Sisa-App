'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { SisaSmileWatermark, SisaSmilePatternGrid } from './sisa-smile-watermark';

// ─── Step Data ────────────────────────────────────────────────────────────────

interface Step {
  id: number;
  number: string;
  title: string;
  label: string;
  body: string;
  image: string;
}

const STEPS: Step[] = [
  {
    id: 0,
    number: '01',
    title: 'Pilah',
    label: 'Pisahkan yang masih punya nilai.',
    body: 'Kenali dan pisahkan sampah berdasarkan jenisnya sebelum melakukan setoran. Plastik, kardus, kaleng, dan kertas yang bersih membuat nilai daur ulangmu maksimal.',
    image: '/images/cara-kerja/step-01-pilah.jpg',
  },
  {
    id: 1,
    number: '02',
    title: 'Setor',
    label: 'Pilih antar sendiri atau jadwalkan penjemputan.',
    body: 'Antar langsung ke titik bank sampah terdekat, atau jadwalkan layanan penjemputan ke rumahmu. Dapatkan tiket QR digital tanpa antre.',
    image: '/images/cara-kerja/step-02-setor.jpg',
  },
  {
    id: 2,
    number: '03',
    title: 'Timbang',
    label: 'Sampahmu ditimbang & diverifikasi.',
    body: 'Admin SI:)SA melakukan penimbangan secara transparan dan terverifikasi. Kamu bisa memantau prosesnya secara real-time melalui aplikasi.',
    image: '/images/cara-kerja/step-03-timbang.jpg',
  },
  {
    id: 3,
    number: '04',
    title: 'Dapatkan Poin',
    label: 'Setiap kilogram bernilai poin nyata.',
    body: 'Poin langsung masuk ke saldo dompet digitalmu segera setelah verifikasi. Semakin banyak setor, semakin besar nilainya.',
    image: '/images/cara-kerja/step-04-poin.jpg',
  },
  {
    id: 4,
    number: '05',
    title: 'Tukar Hadiah',
    label: 'Poinmu bisa jadi hadiah pilihanmu.',
    body: 'Gunakan poinmu untuk menukar hadiah pilihan dari katalog SI:)SA—mulai dari voucher, alat tulis, merchandise, hingga kebutuhan sehari-hari.',
    image: '/images/cara-kerja/step-05-hadiah.jpg',
  },
];

const AUTO_ADVANCE_MS = 5000;

// ─── Main Component ───────────────────────────────────────────────────────────

export function CaraKerjaSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [displayStep, setDisplayStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [isFrameHovered, setIsFrameHovered] = useState(false);
  const [sheen, setSheen] = useState(false);
  const sheenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedProgressRef = useRef(0);
  const activeStepRef = useRef(activeStep);
  const isPausedRef = useRef(isPaused);

  useEffect(() => { activeStepRef.current = activeStep; }, [activeStep]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Crossfade helper — UNCHANGED
  const switchToStep = useCallback((nextIdx: number) => {
    setFadeIn(false);
    setTimeout(() => {
      setActiveStep(nextIdx);
      setDisplayStep(nextIdx);
      setProgress(0);
      startTimeRef.current = null;
      pausedProgressRef.current = 0;
      setFadeIn(true);
    }, 300);
  }, []);

  const advanceStep = useCallback(() => {
    const next = (activeStepRef.current + 1) % STEPS.length;
    switchToStep(next);
  }, [switchToStep]);

  // rAF-based animation loop — UNCHANGED
  const animate = useCallback(
    (timestamp: number) => {
      if (isPausedRef.current) return;
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const base = pausedProgressRef.current;
      const pct = Math.min(base + (elapsed / AUTO_ADVANCE_MS) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        advanceStep();
      }
    },
    [advanceStep],
  );

  const startAnimation = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (prefersReduced) return;
    startTimeRef.current = null;
    animFrameRef.current = requestAnimationFrame(animate);
  }, [animate, prefersReduced]);

  useEffect(() => {
    if (!isPaused) {
      startAnimation();
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPaused, startAnimation]);

  // Restart on step change — UNCHANGED
  useEffect(() => {
    startAnimation();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  const handleStepClick = (idx: number) => {
    if (idx === activeStep) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    switchToStep(idx);
  };

  const handlePause = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    pausedProgressRef.current = progress;
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    startTimeRef.current = null;
  };

  // Sheen fires once on hover-enter, never loops
  const handleFrameEnter = () => {
    setIsFrameHovered(true);
    handlePause();
    if (!prefersReduced) {
      if (sheenTimeoutRef.current) clearTimeout(sheenTimeoutRef.current);
      setSheen(true);
      sheenTimeoutRef.current = setTimeout(() => setSheen(false), 950);
    }
  };

  const handleFrameLeave = () => {
    setIsFrameHovered(false);
    handleResume();
  };

  const frameHover = isFrameHovered && !prefersReduced;

  return (
    <section
      id="cara-kerja"
      className="relative overflow-hidden bg-white"
      style={{ padding: 'clamp(40px, 6vh, 72px) 0' }}
    >
      {/* Ambient radiance */}
      <div className="pointer-events-none absolute top-0 -left-32 -z-10 h-[420px] w-[420px] rounded-full bg-soft-green/20 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[340px] w-[340px] rounded-full bg-smile-yellow/25 blur-2xl" />

      <SisaSmilePatternGrid color="#4CAF50" opacity={0.08} spacing={125} iconSize={20} rotate={10} />
      <SisaSmileWatermark size={280} rotate={18} opacity={0.22} color="yellow" className="absolute -top-8 -right-8 lg:right-12 z-0" />
      <SisaSmileWatermark size={200} rotate={-16} opacity={0.16} color="soft-green" className="absolute top-1/2 -left-12 z-0" />

      {/* Container: 1120px max, 24px side padding */}
      <div className="relative z-10 mx-auto max-w-[1120px] px-6">

        {/* ── Section header ── */}
        <div className="max-w-xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-functional-green" />
            <span className="font-sans text-xs font-medium tracking-widest text-functional-green uppercase">
              Cara Kerja SI:)SA
            </span>
          </div>
          {/* Heading: t-h2--compact, does NOT edit .t-h2 */}
          <h2
            className="mt-3 font-sans font-semibold tracking-tight text-gray-900"
            style={{ fontSize: 'clamp(1.75rem, 2.8vw, 2.5rem)', lineHeight: 1.12 }}
          >
            Semudah itu,{' '}
            <span className="text-functional-green">sampahmu</span> jadi berarti.
          </h2>
          {/* Sub-copy */}
          <p className="mt-2.5 font-sans text-base font-normal leading-relaxed text-gray-500">
            Lima langkah yang nyata — dari pilah hingga hadiah.
          </p>
        </div>

        {/* ── Two-column layout ── */}
        {/*
          Desktop ≥1024px: [1.05fr steps | 0.95fr photo], column-gap clamp(40,5vw,72px)
          Tablet 768–1023px: two equal columns, photo max-width 300px
          Mobile <768px: stack — header → photo (hidden here, shown inside list) → list
        */}
        <div
          className="grid grid-cols-1 items-center md:grid-cols-2 lg:grid-cols-[1.05fr_0.95fr]"
          style={{
            marginTop: 'clamp(24px, 4vh, 40px)',
            columnGap: 'clamp(40px, 5vw, 72px)',
            rowGap: '24px',
          }}
        >

          {/* ── LEFT: Step list ── */}
          {/*
            min-height reserves space for the tallest step state.
            This prevents layout jump when body paragraph expands/collapses.
          */}
          <div className="flex flex-col order-2 md:order-1" style={{ minHeight: '320px' }}>
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div key={step.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleStepClick(idx)}
                    onMouseEnter={handlePause}
                    onMouseLeave={handleResume}
                    onFocus={handlePause}
                    onBlur={handleResume}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleStepClick(idx);
                      }
                    }}
                    className="group relative flex cursor-pointer items-start gap-4 py-3.5 pr-3 outline-none select-none focus-visible:ring-2 focus-visible:ring-functional-green focus-visible:ring-offset-2 rounded-lg"
                    aria-pressed={isActive}
                    aria-label={`Langkah ${step.number}: ${step.title}`}
                  >
                    {/* Number + progress track */}
                    <div className="flex shrink-0 flex-col items-center self-stretch pt-0.5">
                      <span
                        className={`font-sans text-sm font-medium leading-none transition-all duration-300 ${
                          isActive ? 'text-functional-green' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      >
                        {step.number}
                      </span>
                      <div className="mt-2 relative flex-1 w-px min-h-[24px]">
                        <div className="absolute inset-0 w-px bg-gray-200" />
                        {isActive && !prefersReduced && (
                          <div
                            className="absolute left-0 top-0 w-px bg-functional-green origin-top transition-none"
                            style={{ height: `${progress}%` }}
                          />
                        )}
                        {isActive && prefersReduced && (
                          <div className="absolute left-0 top-0 w-px bg-functional-green h-full" />
                        )}
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 pb-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-sans font-medium leading-snug transition-colors duration-200 ${
                            isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
                          }`}
                          style={{ fontSize: '1.0625rem' }}
                        >
                          {step.title}
                        </h3>
                        {isActive && (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-functional-green animate-pulse" />
                        )}
                      </div>

                      {/* Label: slate-500/600 for ≥4.5:1 contrast on white */}
                      <p
                        className={`mt-0.5 font-sans text-sm font-normal leading-snug transition-colors duration-200 ${
                          isActive ? 'text-slate-600' : 'text-slate-500 group-hover:text-slate-600'
                        }`}
                      >
                        {step.label}
                      </p>

                      {/* Body — expands on active, stable layout via max-h */}
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-out ${
                          isActive ? 'max-h-28 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
                        }`}
                      >
                        <p
                          className="font-sans text-sm font-normal text-slate-600 max-w-[40em]"
                          style={{ lineHeight: 1.55 }}
                        >
                          {step.body}
                        </p>
                      </div>

                      {/* Mobile photo — shown only inside list on <md */}
                      {isActive && (
                        <div className="mt-4 w-full max-w-sm md:hidden">
                          <div className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                            <div
                              className="relative w-full overflow-hidden rounded-2xl bg-[#F9F9F8] border border-gray-100 shadow-sm"
                              style={{ aspectRatio: '4/3', maxHeight: '300px' }}
                            >
                              <Image
                                src={step.image}
                                alt={`SI:)SA Langkah ${step.number}: ${step.title}`}
                                fill
                                sizes="(max-width: 640px) 100vw, 384px"
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {idx < STEPS.length - 1 && (
                    <div className="ml-9 h-px bg-gray-100" />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── RIGHT: Photo (md+ only) ── */}
          <div
            className="hidden md:block order-1 md:order-2"
          >
            <div className="sticky top-20">
              {/*
                figure = overflow-hidden frame that clips zoom + sheen.
                Hover state controlled by JS (isFrameHovered) so no CSS-only
                issues with :hover not firing on touch devices.
                All motion effects wrapped in !prefersReduced guard.
              */}
              <figure
                className="relative mx-auto"
                style={{
                  maxWidth: 'min(360px, 100%)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  backgroundColor: '#F9F9F8',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: frameHover
                    ? '0 30px 60px -24px rgba(30,58,32,0.35)'
                    : '0 8px 24px -8px rgba(30,58,32,0.14)',
                  transform: frameHover ? 'translateY(-6px)' : 'translateY(0)',
                  transition: 'transform 300ms cubic-bezier(.2,.8,.2,1), box-shadow 300ms cubic-bezier(.2,.8,.2,1)',
                  willChange: 'transform, box-shadow',
                  aspectRatio: '4/5',
                  height: 'min(58vh, 460px)',
                  width: '100%',
                }}
                onMouseEnter={handleFrameEnter}
                onMouseLeave={handleFrameLeave}
                onFocus={handleFrameEnter}
                onBlur={handleFrameLeave}
                tabIndex={-1}
              >
                {/* Image — crossfade opacity + zoom on hover */}
                <div
                  className="absolute inset-0"
                  style={{
                    opacity: fadeIn ? 1 : 0,
                    transition: 'opacity 300ms ease-in-out',
                    willChange: 'opacity',
                  }}
                >
                  <Image
                    src={STEPS[displayStep].image}
                    alt={`SI:)SA Langkah ${STEPS[displayStep].number}: ${STEPS[displayStep].title}`}
                    fill
                    sizes="(max-width: 1024px) 300px, 360px"
                    priority
                    className="object-cover"
                    style={{
                      transform: frameHover ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 600ms ease-out',
                      willChange: 'transform',
                    }}
                  />
                </div>

                {/* Subtle green tint overlay on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[5] transition-colors duration-300"
                  style={{
                    backgroundColor: frameHover ? 'rgba(76, 175, 80, 0.08)' : 'transparent',
                  }}
                />

                {/* Sheen — diagonal highlight, sweeps left→right once on hover-enter */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 z-10"
                  style={{
                    width: '40%',
                    left: 0,
                    background: 'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)',
                    transform: sheen ? 'translateX(300%) skewX(-18deg)' : 'translateX(-120%) skewX(-18deg)',
                    transition: sheen ? 'transform 900ms cubic-bezier(.4,0,.2,1)' : 'none',
                  }}
                />

                {/* Caption chip — fades in + slides up on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-3 left-3 z-20"
                  style={{
                    opacity: frameHover ? 1 : 0,
                    transform: frameHover ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 250ms ease, transform 250ms ease',
                  }}
                >
                  <span
                    className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-gray-900"
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: '999px',
                      padding: '6px 12px',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                    }}
                  >
                    {STEPS[displayStep].number} · {STEPS[displayStep].title}
                  </span>
                </div>
              </figure>

              {/* Progress dots + step counter */}
              <div
                className="flex items-center justify-between px-1"
                style={{ maxWidth: 'min(360px, 100%)', margin: '12px auto 0' }}
              >
                <div className="flex items-center gap-2">
                  {STEPS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleStepClick(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        activeStep === idx
                          ? 'w-6 bg-functional-green'
                          : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to step ${idx + 1}`}
                    />
                  ))}
                </div>
                {/* Counter turns green on hover */}
                <p
                  className="font-sans text-xs font-medium tracking-wider transition-colors duration-300"
                  style={{ color: frameHover ? 'var(--functional-green)' : '#9CA3AF' }}
                >
                  {STEPS[activeStep].number} / 05
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
