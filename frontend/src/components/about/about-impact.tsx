'use client';

// Single source of impact statistics (configurable, without hardcoding across multiple components)
export const IMPACT_METRICS = [
  {
    value: '1,250+',
    unit: 'KG',
    label: 'Sampah Tersalurkan',
    detail: 'Material berhasil dicegah mencemari lingkungan dan kembali ke rantai daur ulang.',
  },
  {
    value: '100%',
    unit: 'TERVERIFIKASI',
    label: 'Setoran Tercatat',
    detail: 'Seluruh riwayat penimbangan dan alokasi poin tercatat transparan secara digital.',
  },
  {
    value: '4',
    unit: 'KATEGORI',
    label: 'Kategori Sampah',
    detail: 'Plastik PET/HDPE, kardus/karton, kaleng alumunium, dan kertas/majalah.',
  },
  {
    value: ':)',
    unit: 'SENYUM',
    label: 'Setiap Setoran Punya Arti',
    detail: 'Apresiasi nyata dalam bentuk poin yang dapat ditukar dengan kebutuhan harian.',
  },
];

export function AboutImpact() {
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32 lg:py-36 border-b border-gray-100">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 border border-emerald-100 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-functional-green" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-functional-green uppercase">
              OUR IMPACT
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-medium tracking-tight text-gray-900 leading-[1.2]">
            “Small actions. <span className="text-functional-green">Real impact</span>.”
          </h2>

          <div className="mt-6 space-y-4 font-sans text-base sm:text-lg text-gray-600 leading-relaxed">
            <p>
              Perubahan tidak selalu dimulai dari sesuatu yang besar.
            </p>
            <p className="font-medium text-gray-800">
              Kadang, cukup dari satu botol yang dipilah. Satu kardus yang disetorkan. Satu kebiasaan yang dilakukan berulang.
            </p>
          </div>
        </div>

        {/* Editorial Numbers with Whitespace & Fine Separators (NOT a SaaS card dashboard) */}
        <div className="mt-16 lg:mt-24 border-t border-b border-gray-200/80 divide-y divide-gray-200/80">
          
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200/80">
            {/* Metric 1 */}
            <div className="py-12 md:py-16 md:pr-12 lg:pr-16 flex flex-col justify-between">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-display text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-gray-900">
                  {IMPACT_METRICS[0].value}
                </span>
                <span className="font-mono text-xs font-semibold text-functional-green tracking-widest uppercase">
                  {IMPACT_METRICS[0].unit}
                </span>
              </div>
              <div className="mt-6">
                <h3 className="font-display text-xl font-semibold text-gray-900">
                  {IMPACT_METRICS[0].label}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-md">
                  {IMPACT_METRICS[0].detail}
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="py-12 md:py-16 md:pl-12 lg:pl-16 flex flex-col justify-between">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-display text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-gray-900">
                  {IMPACT_METRICS[1].value}
                </span>
                <span className="font-mono text-xs font-semibold text-functional-green tracking-widest uppercase">
                  {IMPACT_METRICS[1].unit}
                </span>
              </div>
              <div className="mt-6">
                <h3 className="font-display text-xl font-semibold text-gray-900">
                  {IMPACT_METRICS[1].label}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-md">
                  {IMPACT_METRICS[1].detail}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200/80">
            {/* Metric 3 */}
            <div className="py-12 md:py-16 md:pr-12 lg:pr-16 flex flex-col justify-between">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-display text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-gray-900">
                  {IMPACT_METRICS[2].value}
                </span>
                <span className="font-mono text-xs font-semibold text-functional-green tracking-widest uppercase">
                  {IMPACT_METRICS[2].unit}
                </span>
              </div>
              <div className="mt-6">
                <h3 className="font-display text-xl font-semibold text-gray-900">
                  {IMPACT_METRICS[2].label}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-md">
                  {IMPACT_METRICS[2].detail}
                </p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="py-12 md:py-16 md:pl-12 lg:pl-16 flex flex-col justify-between">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-functional-green">
                  {IMPACT_METRICS[3].value}
                </span>
                <span className="font-mono text-xs font-semibold text-amber-600 tracking-widest uppercase">
                  {IMPACT_METRICS[3].unit}
                </span>
              </div>
              <div className="mt-6">
                <h3 className="font-display text-xl font-semibold text-gray-900">
                  {IMPACT_METRICS[3].label}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-md">
                  {IMPACT_METRICS[3].detail}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Quiet editorial sign-off */}
        <div className="mt-10 flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>DATA METRIK DAMPAK SI:)SA</span>
          <span>DIPERBARUI SECARA BERKALA</span>
        </div>

      </div>
    </section>
  );
}
