'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, getErrorMessage } from '@/lib/api';
import { Setoran, StatusSetoran } from '@/lib/types';
import { CardSkeleton, EmptyState } from '@/components/ui';
import { StatusBadge } from '@/components/status-badge';
import { useToast } from '@/lib/toast-context';

const TABS: { label: string; statuses: StatusSetoran[] | null }[] = [
  { label: 'Semua', statuses: null },
  { label: 'Aktif', statuses: ['DIAJUKAN', 'DITERIMA', 'SUDAH_DISCAN', 'DIVERIFIKASI'] },
  { label: 'Selesai', statuses: ['SELESAI'] },
  { label: 'Ditolak', statuses: ['DITOLAK', 'DIBATALKAN'] },
];

export default function RiwayatSetoranPage() {
  const [setoran, setSetoran] = useState<Setoran[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    api
      .get<Setoran[]>('/setoran')
      .then((res) => setSetoran(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = setoran.filter((s) => {
    const statuses = TABS[activeTab].statuses;
    return !statuses || statuses.includes(s.status);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Setoran</h1>
        <Link
          href="/setoran/baru"
          className="rounded-lg bg-functional-green px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          + Setor Baru
        </Link>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`flex-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
              activeTab === i ? 'bg-white text-functional-green shadow-sm' : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Tidak ada setoran"
          description="Belum ada pengajuan setoran pada kategori ini."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <Link
              key={s.id}
              href={`/setoran/${s.id}`}
              className="block rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{s.kode}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {s.metode === 'ANTAR_SENDIRI' ? 'Antar Sendiri' : 'Dijemput'} ·{' '}
                    {new Date(s.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.items?.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                  >
                    {item.namaKategoriSnapshot}
                  </span>
                ))}
              </div>
              {s.status === 'SELESAI' && (
                <p className="mt-3 text-sm font-medium text-functional-green">
                  +{s.totalPoin} poin · {s.totalBeratReal} kg
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
