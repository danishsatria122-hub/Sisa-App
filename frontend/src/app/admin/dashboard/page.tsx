'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api, getErrorMessage } from '@/lib/api';
import { DashboardAdmin } from '@/lib/types';
import { CardSkeleton, EmptyState } from '@/components/ui';
import { StatusBadge } from '@/components/status-badge';
import { useToast } from '@/lib/toast-context';

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    api
      .get<DashboardAdmin>('/admin/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-sm text-gray-500">Ringkasan aktivitas Bank Sampah SI:)SA.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <StatCard label="Total Nasabah" value={data?.totalNasabah ?? 0} />
          <StatCard label="Total Pengajuan" value={data?.totalPengajuan ?? 0} />
          <StatCard label="Total Sampah" value={`${data?.totalSampahKg ?? 0} kg`} />
          <StatCard label="Total Poin" value={data?.totalPoin ?? 0} accent />
          <StatCard label="Total Penukaran" value={data?.totalPenukaran ?? 0} />
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-800">Statistik 6 Bulan Terakhir</h2>
        {loading ? (
          <CardSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data?.statistikBulanan}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalKg"
                name="Total kg"
                stroke="#4CAF50"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalPoin"
                name="Total Poin"
                stroke="#FAEF8A"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Transaksi Terbaru</h2>
        {loading ? (
          <CardSkeleton />
        ) : !data?.transaksiTerbaru?.length ? (
          <EmptyState title="Belum ada transaksi" />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th className="px-4 py-3">Kode</th>
                  <th className="px-4 py-3">Nasabah</th>
                  <th className="px-4 py-3">Metode</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {data.transaksiTerbaru.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-800">{t.kode}</td>
                    <td className="px-4 py-3 text-gray-600">{t.user?.name ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {t.metode === 'ANTAR_SENDIRI' ? 'Antar Sendiri' : 'Dijemput'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${
        accent ? 'border-functional-green bg-functional-green/5' : 'border-gray-100 bg-white'
      }`}
    >
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p
        className={`mt-1 text-xl font-bold ${accent ? 'text-functional-green' : 'text-gray-800'}`}
      >
        {value}
      </p>
    </div>
  );
}
