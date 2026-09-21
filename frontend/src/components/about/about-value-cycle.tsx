'use client';

export function AboutValueCycle() {
  const CYCLE_ITEMS = [
    {
      step: '01',
      phase: 'PILAH',
      title: 'Pilah dengan Sadar',
      desc: 'Memisahkan material bersih di rumah sebelum terlanjur kotor dan kehilangan nilai daur ulangnya.',
      accent: 'border-primary-green/40 bg-emerald-50/60',
      stepColor: 'text-functional-green',
    },
    {
      step: '02',
      phase: 'SETOR',
      title: 'Setor Tanpa Antre',
      desc: 'Menyalurkan benda terpilah ke bank sampah terdekat atau melalui layanan jemput digital yang terjadwal.',
      accent: 'border-smile-yellow/50 bg-amber-50/60',
      stepColor: 'text-amber-600',
    },
    {
      step: '03',
      phase: 'TIMBANG',
      title: 'Timbang Terbuka',
      desc: 'Setiap kilogram dihitung dan diverifikasi secara transparan langsung ke dalam pencatatan nasabah.',
      accent: 'border-digital-accent/60 bg-teal-50/50',
      stepColor: 'text-teal-600',
    },
    {
      step: '04',
      phase: 'MANFAAT',
      title: 'Manfaat yang Kembali',
      desc: 'Poin digital yang terkumpul dapat dimanfaatkan kembali untuk berbagai kebutuhan sehari-hari.',
      accent: 'border-primary-green/40 bg-emerald-50/60',
      stepColor: 'text-functional-green',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FAFAF8] py-24 sm:py-32 lg:py-36 border-b border-gray-100">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 border border-emerald-200/80 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary-green" />
            <span className="text-[11px] font-semibold tracking-[0.22em] text-functional-green uppercase">
              HOW WE SEE VALUE
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-medium text-gray-900 leading-[1.2] tracking-tight">
            Dari kebiasaan sederhana,<br />
            <span className="text-functional-green">menjadi siklus yang bermakna.</span>
          </h2>

          <p className="mt-6 font-sans text-base sm:text-lg text-gray-500 leading-relaxed">
            Pengelolaan sampah tidak harus rumit. Ketika setiap tahap saling terhubung dengan jelas, barang yang tersisa menemukan jalan kembali menjadi sesuatu yang berharga.
          </p>
        </div>

        {/* Creative Editorial 4-Phase Grid */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CYCLE_ITEMS.map((item) => (
            <div
              key={item.step}
              className={`group relative rounded-2xl border ${item.accent} p-7 transition-all duration-300 hover:shadow-md hover:-translate-y-1`}
            >
              {/* Phase stamp */}
              <div className="flex items-center justify-between mb-5">
                <span className={`font-mono text-[11px] font-bold tracking-widest uppercase ${item.stepColor}`}>
                  {item.phase}
                </span>
                <span className="font-mono text-2xl font-light text-gray-200 leading-none">
                  {item.step}
                </span>
              </div>

              {/* Phase title */}
              <h3 className="font-display text-lg sm:text-xl font-medium text-gray-900 leading-snug">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-3 font-sans text-sm text-gray-500 leading-relaxed">
                {item.desc}
              </p>

              {/* Bottom accent line */}
              <div className={`mt-6 h-0.5 w-8 rounded-full bg-current ${item.stepColor} opacity-40 group-hover:w-16 transition-all duration-300`} />
            </div>
          ))}
        </div>

        {/* Connecting Arrow Visual between phases on desktop */}
        <p className="mt-10 text-center font-mono text-xs text-gray-400 tracking-widest">
          PILAH → SETOR → TIMBANG → MANFAAT
        </p>

      </div>
    </section>
  );
}
