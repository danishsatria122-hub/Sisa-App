'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, getErrorMessage } from '@/lib/api';
import { PageSpinner } from '@/components/ui';
import { StatusBadge } from '@/components/status-badge';
import { useToast } from '@/lib/toast-context';

interface NotaPenukaran {
  kodePenukaran: string;
  hadiah: string;
  poinTerpakai: number;
  status: string;
  tanggal: string;
}

export default function NotaPenukaranPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [nota, setNota] = useState<NotaPenukaran | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<NotaPenukaran>(`/penukaran/${id}/nota`)
      .then((res) => setNota(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <PageSpinner />;
  if (!nota) return null;

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="no-print flex items-center justify-between">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">
          ← Kembali
        </button>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-functional-green px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          🖨️ Cetak Nota
        </button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 text-center">
          <h1 className="font-logo text-2xl text-functional-green">SI:)SA</h1>
          <p className="text-xs text-gray-400">Nota Penukaran Poin</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Kode Penukaran</span>
            <span className="font-medium text-gray-800">{nota.kodePenukaran}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Hadiah</span>
            <span className="font-medium text-gray-800">{nota.hadiah}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Poin Terpakai</span>
            <span className="font-medium text-gray-800">{nota.poinTerpakai} poin</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tanggal</span>
            <span className="font-medium text-gray-800">
              {new Date(nota.tanggal).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-gray-500">Status</span>
            <StatusBadge status={nota.status} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Tunjukkan nota ini saat pengambilan hadiah di Bank Sampah 🌱
        </p>
      </div>
    </div>
  );
}
