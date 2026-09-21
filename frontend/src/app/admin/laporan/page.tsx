'use client';

import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { LaporanBulanan } from '@/lib/types';
import { CardSkeleton, EmptyState } from '@/components/ui';
import { useToast } from '@/lib/toast-context';

const BULAN_LABEL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function AdminLaporanPage() {
  const now = new Date();
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());
  const [data, setData] = useState<LaporanBulanan | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    api
      .get<LaporanBulanan>('/admin/laporan/bulanan', { params: { bulan, tahun } })
      .then((res) => setData(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulan, tahun]);

  const handleExportCsv = () => {
    if (!data) return;

    const rows: string[][] = [
      ['LAPORAN BULANAN BANK SAMPAH SI:)SA'],
      ['Periode', `${BULAN_LABEL[bulan - 1]} ${tahun}`],
      ['Tanggal Export', new Date().toLocaleDateString('id-ID')],
      [],
      ['RINGKASAN METRIK'],
      ['Metrik', 'Nilai'],
      ['Total Sampah (kg)', data.totalKg.toFixed(2)],
      ['Total Sampah (ton)', data.totalTon.toFixed(3)],
      ['Estimasi Pembayaran (Rp)', String(data.estimasiPembayaran)],
      ['Total Poin Diterbitkan', String(data.totalPoinDiterbitkan)],
      [],
      ['BREAKDOWN PER KATEGORI SAMPAH'],
      ['Kategori', 'Berat (kg)', 'Total Poin', 'Estimasi (Rp)'],
      ...data.breakdownKategori.map((b) => [
        `"${b.kategori.replace(/"/g, '""')}"`,
        b.totalBeratReal.toFixed(2),
        String(b.totalPoin),
        String(b.estimasi),
      ]),
      [],
      ['REKAP PENUKARAN POIN'],
      ['Status / Indikator', 'Jumlah'],
      ['Total Penukaran', String(data.rekapPenukaran.totalPenukaran)],
      ['Poin Ditukar', String(data.rekapPenukaran.totalPoinDitukar)],
      ['Penukaran Selesai', String(data.rekapPenukaran.selesai)],
      ['Penukaran Dibatalkan', String(data.rekapPenukaran.dibatalkan)],
    ];

    const csvContent = '\uFEFF' + rows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan-SISA-${BULAN_LABEL[bulan - 1]}-${tahun}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Laporan bulanan berhasil diexport ke CSV', 'success');
  };

  return (
    <div className="space-y-5">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Laporan Bulanan</h1>
        <div className="flex gap-2">
          <select
            value={bulan}
            onChange={(e) => setBulan(parseInt(e.target.value, 10))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {BULAN_LABEL.map((b, i) => (
              <option key={b} value={i + 1}>
                {b}
              </option>
            ))}
          </select>
          <select
            value={tahun}
            onChange={(e) => setTahun(parseInt(e.target.value, 10))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {[now.getFullYear(), now.getFullYear() - 1, now.getFullYear() - 2].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            onClick={handleExportCsv}
            disabled={!data || loading}
            className="rounded-lg border border-functional-green bg-white px-4 py-2 text-sm font-semibold text-functional-green hover:bg-functional-green/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📥 Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-functional-green px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            🖨️ Cetak
          </button>
        </div>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : !data ? (
        <EmptyState title="Gagal memuat laporan" />
      ) : (
        <>
          <div className="text-center text-sm text-gray-500 print:block hidden">
            Laporan Bulanan SI:)SA — {BULAN_LABEL[bulan - 1]} {tahun}
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="Total Sampah" value={`${data.totalKg.toFixed(1)} kg`} />
            <StatCard label="Total (Ton)" value={`${data.totalTon.toFixed(3)} ton`} />
            <StatCard
              label="Estimasi Pembayaran"
              value={`Rp${data.estimasiPembayaran.toLocaleString('id-ID')}`}
            />
            <StatCard label="Poin Diterbitkan" value={data.totalPoinDiterbitkan} accent />
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-gray-800">Breakdown per Kategori</h2>
            {data.breakdownKategori.length === 0 ? (
              <EmptyState title="Tidak ada data pada periode ini" />
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 text-left text-xs text-gray-500">
                  <tr>
                    <th className="py-2">Kategori</th>
                    <th className="py-2">Berat (kg)</th>
                    <th className="py-2">Poin</th>
                    <th className="py-2">Estimasi (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.breakdownKategori.map((b) => (
                    <tr key={b.kategori} className="border-b border-gray-50 last:border-0">
                      <td className="py-2 font-medium text-gray-800">{b.kategori}</td>
                      <td className="py-2 text-gray-600">{b.totalBeratReal.toFixed(1)}</td>
                      <td className="py-2 text-gray-600">{b.totalPoin}</td>
                      <td className="py-2 text-gray-600">
                        {b.estimasi.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-gray-800">Rekap Penukaran</h2>
            <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              <RekapItem label="Total Penukaran" value={data.rekapPenukaran.totalPenukaran} />
              <RekapItem label="Poin Ditukar" value={data.rekapPenukaran.totalPoinDitukar} />
              <RekapItem label="Selesai" value={data.rekapPenukaran.selesai} />
              <RekapItem label="Dibatalkan" value={data.rekapPenukaran.dibatalkan} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${
        accent ? 'border-functional-green bg-functional-green/5' : 'border-gray-100 bg-white'
      }`}
    >
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${accent ? 'text-functional-green' : 'text-gray-800'}`}>
        {value}
      </p>
    </div>
  );
}

function RekapItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 text-center">
      <p className="text-lg font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
