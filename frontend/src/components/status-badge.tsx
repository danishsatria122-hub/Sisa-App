const STYLES: Record<string, string> = {
  DIAJUKAN:    'bg-smile-yellow/30 text-yellow-800',
  DITERIMA:    'bg-digital-accent/40 text-teal-800',
  SUDAH_DISCAN:'bg-blue-100 text-blue-800',
  DIVERIFIKASI:'bg-digital-accent/40 text-teal-800',
  SELESAI:     'bg-functional-green/15 text-functional-green',
  DITOLAK:     'bg-red-100 text-red-600',
  DIBATALKAN:  'bg-gray-100 text-gray-500',
  DIPROSES:    'bg-soft-green/40 text-green-800',
};

const LABELS: Record<string, string> = {
  DIAJUKAN:    'Diajukan',
  DITERIMA:    'Diterima',
  SUDAH_DISCAN:'Sudah Discan',
  DIVERIFIKASI:'Diverifikasi',
  SELESAI:     'Selesai',
  DITOLAK:     'Ditolak',
  DIBATALKAN:  'Dibatalkan',
  DIPROSES:    'Diproses',
};

/** Dot color for the small status indicator dot */
const DOT_STYLES: Record<string, string> = {
  DIAJUKAN:    'bg-yellow-500',
  DITERIMA:    'bg-teal-500',
  SUDAH_DISCAN:'bg-blue-500',
  DIVERIFIKASI:'bg-teal-500',
  SELESAI:     'bg-functional-green',
  DITOLAK:     'bg-red-500',
  DIBATALKAN:  'bg-gray-400',
  DIPROSES:    'bg-soft-green',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${
        STYLES[status] ?? 'bg-gray-100 text-gray-600'
      }`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_STYLES[status] ?? 'bg-gray-400'}`} />
      {LABELS[status] ?? status}
    </span>
  );
}
