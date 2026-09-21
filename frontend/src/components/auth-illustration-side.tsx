'use client';

import Link from 'next/link';
import { SisaLogo } from './sisa-logo';
import { SisaSmileWatermark, SisaSmilePatternGrid } from './sisa-smile-watermark';

interface AuthIllustrationSideProps {
  title?: string;
  subtitle?: string;
  badge?: string;
}

export function AuthIllustrationSide({
  title = 'Yang tersisa bukan berarti tidak bernilai.',
  subtitle = 'Ubah sampah terpilah menjadi senyuman, poin, dan dampak lingkungan yang nyata.',
  badge = 'Bank Sampah Digital',
}: AuthIllustrationSideProps) {
  return (
    <div className="relative hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between overflow-hidden bg-functional-green p-10 xl:p-14 text-white select-none min-h-screen">

      {/* ─── Background Texture ─────────────────────────────────────── */}
      <SisaSmilePatternGrid
        color="#FFFFFF"
        opacity={0.06}
        spacing={110}
        iconSize={20}
        rotate={-12}
      />

      {/* Corner Accent Watermarks */}
      <SisaSmileWatermark
        size={320}
        rotate={18}
        opacity={0.13}
        color="yellow"
        className="absolute -top-14 -right-14 z-0"
      />
      <SisaSmileWatermark
        size={200}
        rotate={-22}
        opacity={0.10}
        color="white"
        className="absolute -bottom-10 -left-10 z-0"
      />

      {/* ─── Top Bar ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between">
        <Link href="/" className="inline-block transition hover:opacity-80" aria-label="Beranda SI:)SA">
          <SisaLogo variant="white" height={38} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/85 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
        >
          <span aria-hidden="true">←</span>
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* ─── Center: Editorial Story ─────────────────────────────────── */}
      <div className="relative z-10 my-auto py-8 max-w-md">

        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-smile-yellow" />
          <span className="font-sans text-xs font-semibold tracking-[0.14em] text-smile-yellow uppercase">
            {badge}
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="mt-4 font-sans text-3xl xl:text-4xl font-medium tracking-tight text-white leading-[1.22]">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-[15px] text-white/80 leading-relaxed font-normal">
          {subtitle}
        </p>

        {/* Divider line */}
        <div className="mt-8 h-px w-12 bg-white/25 rounded-full" />

        {/* Brand Story Quote */}
        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-smile-yellow/20 border border-smile-yellow/40 flex items-center justify-center">
              <span className="text-smile-yellow text-[10px] font-bold">✓</span>
            </span>
            <p className="font-sans text-sm text-white/80 leading-snug">
              Setoran daur ulang tercatat otomatis
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-smile-yellow/20 border border-smile-yellow/40 flex items-center justify-center">
              <span className="text-smile-yellow text-[10px] font-bold">✓</span>
            </span>
            <p className="font-sans text-sm text-white/80 leading-snug">
              Poin langsung masuk ke saldo akunmu
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-smile-yellow/20 border border-smile-yellow/40 flex items-center justify-center">
              <span className="text-smile-yellow text-[10px] font-bold">✓</span>
            </span>
            <p className="font-sans text-sm text-white/80 leading-snug">
              Tukar poin dengan hadiah nyata
            </p>
          </div>
        </div>

        {/* Tagline quote block */}
        <div className="mt-10 border-l-2 border-smile-yellow/60 pl-4">
          <p className="font-sans text-sm italic text-white/70 leading-relaxed">
            "A little smile for things left behind."
          </p>
          <p className="mt-1 font-sans text-xs font-semibold text-smile-yellow/90 tracking-wide">
            — SI:)SA
          </p>
        </div>
      </div>

      {/* ─── Bottom Legal ───────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between text-xs text-white/50 font-normal">
        <span>© 2026 SI:)SA. Semua hak dilindungi.</span>
        <span>v1.0</span>
      </div>
    </div>
  );
}
