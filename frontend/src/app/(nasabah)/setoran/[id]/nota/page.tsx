'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, getErrorMessage } from '@/lib/api';
import { PageSpinner } from '@/components/ui';
import { useToast } from '@/lib/toast-context';

interface Nota {
  kodeTransaksi: string;
  tanggal: string;
  items: {
    kategori: string;
    beratReal: number;
    hargaPerKg: number;
    poinPerKg: number;
    poinDidapat: number;
  }[];
  totalBeratReal: number;
  totalPoin: number;
}

export default function NotaSetoranPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [nota, setNota] = useState<Nota | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Nota>(`/setoran/${id}/nota`)
      .then((res) => setNota(res.data))
      .catch((err) => {
        showToast(getErrorMessage(err), 'error');
        router.push(`/setoran/${id}`);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <PageSpinner />;
  if (!nota) return null;

  const totalHarga = nota.items.reduce((sum, i) => sum + i.beratReal * i.hargaPerKg, 0);

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
          <p className="text-xs text-gray-400">Nota Transaksi Setoran</p>
        </div>

        <div className="space-y-1 border-b border-dashed border-gray-200 pb-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Kode Transaksi</span>
            <span className="font-medium text-gray-800">{nota.kodeTransaksi}</span>
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
        </div>

        <div className="space-y-3 py-3">
          {nota.items.map((item, i) => (
            <div key={i} className="text-sm">
              <p className="font-medium text-gray-800">{item.kategori}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {item.beratReal} kg × Rp{item.hargaPerKg.toLocaleString('id-ID')}/kg
                </span>
                <span>Rp{(item.beratReal * item.hargaPerKg).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs text-functional-green">
                <span>
                  {item.beratReal} kg × {item.poinPerKg} poin/kg
                </span>
                <span>+{item.poinDidapat} poin</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-1 border-t border-dashed border-gray-200 pt-3 text-sm font-semibold text-gray-800">
          <div className="flex justify-between">
            <span>Total Berat</span>
            <span>{nota.totalBeratReal} kg</span>
          </div>
          <div className="flex justify-between">
            <span>Estimasi Nilai</span>
            <span>Rp{totalHarga.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-functional-green">
            <span>Total Poin</span>
            <span>+{nota.totalPoin} poin</span>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Terima kasih sudah peduli lingkungan bersama SI:)SA 🌱
        </p>
      </div>
    </div>
  );
}
