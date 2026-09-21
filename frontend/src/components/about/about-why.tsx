'use client';

export function AboutWhy() {
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32 lg:py-40 border-b border-gray-100">
      {/* Subtle offset circle accent */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-green/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 text-center">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 border border-emerald-200/80 mb-6 sm:mb-8">
          <span className="h-2 w-2 rounded-full bg-primary-green shadow-[0_0_6px_#68E36D]" />
          <span className="text-[11px] font-semibold tracking-[0.22em] text-functional-green uppercase">
            KENAPA SI:)SA?
          </span>
        </div>

        {/* Headline — Bigger & Creative */}
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[62px] font-medium text-gray-900 leading-[1.18] sm:leading-[1.12] tracking-tight max-w-3xl mx-auto">
          Karena kami melihat nilai<br />
          <span className="text-functional-green relative inline-block">
            di tempat yang sering dilewatkan.
          </span>
        </h2>

        {/* Large Pull-Quote Accent */}
        <div className="mt-10 sm:mt-14 mx-auto max-w-2xl">
          <blockquote className="relative font-display text-xl sm:text-2xl lg:text-3xl text-gray-400 font-light italic leading-relaxed">
            <span className="absolute -top-6 -left-2 text-6xl text-primary-green/30 font-serif select-none leading-none">"</span>
            Benda berhenti digunakan bukan karena tidak bernilai, tetapi karena kita berhenti melihat kemungkinan di dalamnya.
            <span className="absolute -bottom-8 -right-2 text-6xl text-primary-green/30 font-serif select-none leading-none">"</span>
          </blockquote>
        </div>

        {/* Supporting Copy */}
        <div className="mt-14 sm:mt-16 font-sans text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
          <p>
            SI:)SA hadir untuk membuat proses itu lebih mudah. Sampah yang dipilah dapat disetor, ditimbang, diubah menjadi poin, lalu ditukarkan menjadi sesuatu yang kembali berarti.
          </p>
        </div>

        {/* SI:)SA Brand Accent Separator */}
        <div className="mt-16 sm:mt-20 flex items-center justify-center gap-3" aria-hidden="true">
          <div className="h-px w-12 bg-gray-200" />
          <div className="h-2 w-2 rounded-full bg-primary-green opacity-60" />
          <div className="h-px w-12 bg-gray-200" />
        </div>

      </div>
    </section>
  );
}
