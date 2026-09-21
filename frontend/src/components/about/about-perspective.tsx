'use client';

export function AboutPerspective() {
  return (
    <section className="relative overflow-hidden bg-functional-green py-24 sm:py-32 lg:py-36 border-b border-emerald-700/30 text-white">
      {/* Subtle radial texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />
      {/* Soft yellow glow in the corner */}
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-smile-yellow/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 text-center">
        
        {/* Section Label */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 border border-white/20 backdrop-blur-sm mb-8">
          <span className="text-[11px] font-semibold tracking-[0.22em] text-smile-yellow uppercase">
            OUR PERSPECTIVE
          </span>
        </div>

        {/* Large Impactful Green-on-Green Statement */}
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[64px] font-medium text-white leading-[1.16] sm:leading-[1.12] tracking-tight max-w-4xl mx-auto">
          "Yang kami ubah bukan hanya{' '}
          <span className="text-smile-yellow">sampahnya</span>,<br />
          tetapi <span className="underline decoration-white/40 decoration-wavy decoration-2 underline-offset-8">cara kita melihatnya</span>."
        </h2>

        {/* Divider */}
        <div className="mt-12 mx-auto w-16 h-px bg-white/25" aria-hidden="true" />

        {/* Sincere Narrative */}
        <div className="mt-10 sm:mt-12 space-y-4 font-sans text-base sm:text-lg text-green-50/90 leading-relaxed max-w-2xl mx-auto">
          <p>
            Ketika seseorang menyisihkan botol plastik atau melipat kardus bekas di rumahnya, itu bukan sekadar mengurus barang yang sudah tidak dipakai.
          </p>
          <p className="font-medium text-white text-lg sm:text-xl">
            Itu adalah keputusan sadar untuk tidak membiarkan sesuatu terbuang sia-sia.
          </p>
          <p className="text-green-50/80">
            SI:)SA hadir agar langkah kecil itu terasa lebih sederhana, transparan saat ditimbang, dan memberi apresiasi nyata kembali ke tangan nasabah.
          </p>
        </div>

      </div>
    </section>
  );
}
