'use client';

import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { Hadiah } from '@/lib/types';
import { CardSkeleton, EmptyState, ConfirmModal } from '@/components/ui';
import { useToast } from '@/lib/toast-context';
import { useAuth } from '@/lib/auth-context';

export default function KatalogHadiahPage() {
  const [hadiahList, setHadiahList] = useState<Hadiah[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Hadiah | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { user, refreshUser } = useAuth();

  const load = () => {
    setLoading(true);
    api
      .get<Hadiah[]>('/hadiah')
      .then((res) => setHadiahList(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saldo = user?.pointBalance ?? 0;

  const handleTukar = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await api.post('/penukaran', { hadiahId: selected.id });
      showToast(`Berhasil menukar ${selected.nama}!`, 'success');
      setSelected(null);
      load();
      refreshUser();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Katalog Hadiah</h1>
        <div className="rounded-lg bg-functional-green/10 px-4 py-2 text-sm font-semibold text-functional-green">
          Saldo: {saldo} poin
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : hadiahList.length === 0 ? (
        <EmptyState title="Belum ada hadiah" description="Admin belum menambahkan hadiah." />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {hadiahList.map((h) => {
            const habis = h.statusStok === 'HABIS';
            const kurang = saldo < h.poinDibutuhkan;
            return (
              <div
                key={h.id}
                data-testid="hadiah-card"
                className="flex flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex h-24 items-center justify-center overflow-hidden rounded-lg bg-digital-accent/40">
                  {h.foto_url ? (
                    <img
                      src={h.foto_url}
                      alt={h.nama}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">🎁</span>
                  )}
                </div>
                <p className="font-semibold text-gray-800">{h.nama}</p>
                {h.deskripsi && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{h.deskripsi}</p>
                )}
                <p className="mt-2 text-sm font-semibold text-functional-green">
                  {h.poinDibutuhkan} poin
                </p>
                <p className="text-xs text-gray-400">
                  {habis ? 'Stok habis' : `Stok: ${h.stok}`}
                </p>
                <button
                  onClick={() => setSelected(h)}
                  disabled={habis || kurang}
                  className="mt-3 rounded-lg bg-functional-green py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {habis ? 'Habis' : kurang ? `Kurang ${h.poinDibutuhkan - saldo} poin` : 'Tukar'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={!!selected}
        title={`Tukar ${selected?.nama}?`}
        description={`Poin Anda akan dikurangi ${selected?.poinDibutuhkan} poin. Hadiah dapat diambil langsung di Bank Sampah.`}
        confirmLabel={submitting ? 'Memproses...' : 'Ya, Tukar'}
        onConfirm={handleTukar}
        onCancel={() => setSelected(null)}
      />
    </div>
  );
}
