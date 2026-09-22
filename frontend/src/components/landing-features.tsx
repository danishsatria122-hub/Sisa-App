'use client';

import Link from 'next/link';
import { CaraKerjaSection } from './cara-kerja-section';
import { KenaliSisaSection } from './kenali-sisa-section';
import { SisaSmileWatermark } from './sisa-smile-watermark';
import { PublicReveal } from './public-reveal';

export function LandingFeatures() {
  const categories = [
    {
      title: 'Plastik PET & HDPE',
      rate: '150 Poin / kg',
      items: 'Botol minuman, galon bekas, wadah plastik bersih',
      color: 'bg-primary-green/10 border-primary-green/40 text-functional-green',
      icon: '🧴',
    },
    {
      title: 'Kardus & Karton',
      rate: '120 Poin / kg',
      items: 'Kardus paket, box sepatu, kemasan karton kering',
      color: 'bg-smile-yellow/25 border-smile-yellow/60 text-gray-800',
      icon: '📦',
    },
    {
      title: 'Kaleng Alumunium',
      rate: '200 Poin / kg',
      items: 'Kaleng minuman, kaleng makanan ringan',
      color: 'bg-digital-accent/35 border-digital-accent text-gray-800',
      icon: '🥫',
    },
    {
      title: 'Kertas & Majalah',
      rate: '90 Poin / kg',
      items: 'Kertas HVS, buku bekas, koran, brosur',
      color: 'bg-soft-green/20 border-soft-green/50 text-functional-green',
      icon: '📄',
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. KENALI SI:)SA / BRAND STORY SECTION */}
      <KenaliSisaSection />

      {/* 2. CARA KERJA SECTION (Interactive 2-Column Storytelling) */}
      <CaraKerjaSection />

      {/* 3. KATEGORI SAMPAH SECTION */}
      <section id="kategori" className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 lg:px-8">
        <div>
          <span className="inline-block rounded-full bg-smile-yellow/30 border border-smile-yellow/60 px-4 py-1 text-xs font-medium text-gray-800 uppercase tracking-wider">
            Daur Ulang
          </span>
          <h2 className="mt-3 font-sans text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
            Kategori Sampah & Poin
          </h2>
          <p className="mt-2 text-base font-normal text-gray-600">
            Semua kategori sampah ditimbang dan dikonversi langsung menjadi poin.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <div
              key={c.title}
              className={`rounded-3xl border p-6 transition-all duration-300 hover:shadow-md ${c.color}`}
            >
              <div className="text-3xl">{c.icon}</div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">{c.title}</h3>
              <div className="mt-2 inline-block rounded-lg bg-white px-3 py-1 text-xs font-medium text-gray-900 shadow-xs border border-gray-200">
                {c.rate}
              </div>
              <p className="mt-3 text-xs font-normal text-gray-600">{c.items}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CTA BANNER AT BOTTOM */}
      <section
        id="keuntungan"
        className="relative z-0 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
        style={{
          paddingTop: 'clamp(48px, 7vh, 80px)',
          paddingBottom: 'clamp(48px, 7vh, 80px)',
        }}
      >
        <PublicReveal
          as="div"
          className="relative rounded-3xl bg-functional-green text-white overflow-hidden"
          style={{
            padding: 'clamp(32px, 5vw, 64px)',
            boxShadow: '0 20px 40px -24px rgba(30, 58, 32, 0.25)',
          }}
        >
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-80 w-80 rounded-full bg-white/20 blur-xl pointer-events-none" />

          {/* Large Fun & Charming Smile Watermark in Banner */}
          <SisaSmileWatermark
            size={360}
            rotate={18}
            opacity={0.26}
            color="yellow"
            className="absolute -right-12 -bottom-16 z-0 pointer-events-none"
          />
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block t-eyebrow text-smile-yellow">
              Mulai Langkah Kecilmu
            </span>
            <h2
              className="mt-2 font-display text-white"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                textWrap: 'balance',
                maxWidth: '16em',
              }}
            >
              Siap membuat bumi dan dompetmu tersenyum? :)
            </h2>
            <p className="text-white/95"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.3vw, 1.125rem)',
                fontWeight: 400,
                lineHeight: 1.65,
                maxWidth: '34em',
                marginTop: '16px',
              }}
            >
              Bergabung bersama ribuan nasabah muda SI:)SA lainnya. Mulai setor sampah daur ulang pertamamu hari ini!
            </p>
            <div className="mt-8 flex flex-col min-[480px]:flex-row min-[480px]:items-center gap-3">
              <Link
                href="/register"
                className="inline-flex h-[52px] w-full min-[480px]:w-auto items-center justify-center rounded-full bg-white px-7 font-sans text-base font-semibold text-functional-green transition-all duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-4px_rgba(30,58,32,0.25)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px] motion-reduce:transform-none motion-reduce:transition-colors shrink-0 select-none"
              >
                Mulai Setor Sekarang :)
              </Link>
              <Link
                href="/login"
                className="inline-flex h-[52px] w-full min-[480px]:w-auto items-center justify-center rounded-full border border-white/70 bg-transparent px-7 font-sans text-base font-semibold text-white transition-all duration-200 hover:bg-white/[0.14] hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px] motion-reduce:transform-none motion-reduce:transition-colors shrink-0 select-none"
              >
                Masuk ke Akun
              </Link>
            </div>
          </div>
        </PublicReveal>
      </section>
    </div>
  );
}

