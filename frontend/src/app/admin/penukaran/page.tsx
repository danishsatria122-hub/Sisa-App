'use client';

import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { Penukaran, StatusPenukaran } from '@/lib/types';
import { CardSkeleton, EmptyState, ConfirmModal } from '@/components/ui';
import { StatusBadge } from '@/components/status-badge';
import { useToast } from '@/lib/toast-context';

export default function AdminPenukaranPage() {
  const [list, setList] = useState<Penukaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StatusPenukaran | ''>('');
  const [batalTarget, setBatalTarget] = useState<Penukaran | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    api
      .get<Penukaran[]>('/admin/penukaran', { params: status ? { status } : {} })
      .then((res) => setList(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSelesai = async (p: Penukaran) => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/penukaran/${p.id}/status`, { action: 'selesai' });
      showToast(`Penukaran ${p.kode} diselesaikan`, 'success');
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBatal = async () => {
    if (!batalTarget) return;
    setActionLoading(true);
    try {
      await api.patch(`/admin/penukaran/${batalTarget.id}/status`, { action: 'batal' });
      showToast(`Penukaran dibatalkan, poin dikembalikan ke ${batalTarget.user?.name}`, 'success');
      setBatalTarget(null);
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">Kelola Penukaran</h1>

      <div className="flex gap-2">
        {(['', 'DIPROSES', 'SELESAI', 'DIBATALKAN'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              status === s ? 'bg-functional-green text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {s === '' ? 'Semua' : s === 'DIPROSES' ? 'Diproses' : s === 'SELESAI' ? 'Selesai' : 'Dibatalkan'}
          </button>
        ))}
      </div>

      {loading ? (
        <CardSkeleton />
      ) : list.length === 0 ? (
        <EmptyState title="Tidak ada penukaran" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs text-gray-500">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Nasabah</th>
                <th className="px-4 py-3">Hadiah</th>
                <th className="px-4 py-3">Poin</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-800">{p.kode}</td>
                  <td className="px-4 py-3 text-gray-600">{p.user?.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.namaHadiahSnapshot}</td>
                  <td className="px-4 py-3 text-gray-600">{p.poinTerpakai}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3">
                    {p.status === 'DIPROSES' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSelesai(p)}
                          disabled={actionLoading}
                          className="text-xs font-medium text-functional-green hover:underline"
                        >
                          Selesai
                        </button>
                        <button
                          onClick={() => setBatalTarget(p)}
                          className="text-xs font-medium text-red-500 hover:underline"
                        >
                          Batal
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!batalTarget}
        title={`Batalkan penukaran ${batalTarget?.kode}?`}
        description={`${batalTarget?.poinTerpakai} poin akan dikembalikan ke ${batalTarget?.user?.name} dan stok hadiah bertambah 1.`}
        confirmLabel={actionLoading ? 'Memproses...' : 'Ya, Batalkan'}
        danger
        onConfirm={handleBatal}
        onCancel={() => setBatalTarget(null)}
      />
    </div>
  );
}
