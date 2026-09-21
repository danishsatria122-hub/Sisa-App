'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, getErrorMessage } from '@/lib/api';
import { Penukaran } from '@/lib/types';
import { CardSkeleton, EmptyState } from '@/components/ui';
import { StatusBadge } from '@/components/status-badge';
import { useToast } from '@/lib/toast-context';

export default function RiwayatPenukaranPage() {
  const [list, setList] = useState<Penukaran[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    api
      .get<Penukaran[]>('/penukaran')
      .then((res) => setList(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">Riwayat Penukaran</h1>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          title="Belum ada penukaran"
          description="Tukarkan poin Anda dengan hadiah menarik di katalog."
          action={
            <Link
              href="/hadiah"
              className="rounded-lg bg-functional-green px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Lihat Katalog Hadiah
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {list.map((p) => (
            <Link
              key={p.id}
              href={`/penukaran/${p.id}/nota`}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div>
                <p className="font-semibold text-gray-800">{p.namaHadiahSnapshot}</p>
                <p className="text-xs text-gray-500">
                  {p.kode} ·{' '}
                  {new Date(p.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700">
                  −{p.poinTerpakai} poin
                </p>
              </div>
              <StatusBadge status={p.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
