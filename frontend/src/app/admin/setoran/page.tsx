'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getErrorMessage } from '@/lib/api';
import { Setoran, StatusSetoran } from '@/lib/types';
import { CardSkeleton, EmptyState, Modal } from '@/components/ui';
import { StatusBadge } from '@/components/status-badge';
import { QrScanner } from '@/components/qr-scanner';
import { useToast } from '@/lib/toast-context';

const STATUS_OPTIONS: { value: StatusSetoran | ''; label: string }[] = [
  { value: '', label: 'Semua Status' },
  { value: 'DIAJUKAN', label: 'Diajukan' },
  { value: 'DITERIMA', label: 'Diterima' },
  { value: 'SUDAH_DISCAN', label: 'Sudah Discan' },
  { value: 'DIVERIFIKASI', label: 'Diverifikasi' },
  { value: 'SELESAI', label: 'Selesai' },
  { value: 'DITOLAK', label: 'Ditolak' },
  { value: 'DIBATALKAN', label: 'Dibatalkan' },
];

export default function AdminKelolaPengajuanPage() {
  const [list, setList] = useState<Setoran[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StatusSetoran | ''>('');
  const [metode, setMetode] = useState('');
  const [search, setSearch] = useState('');

  const [detailTarget, setDetailTarget] = useState<Setoran | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Setoran | null>(null);
  const [alasanTolak, setAlasanTolak] = useState('');
  const [scanOpen, setScanOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  const load = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (metode) params.metode = metode;
    if (search) params.search = search;
    api
      .get<Setoran[]>('/admin/setoran', { params })
      .then((res) => setList(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, metode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    load();
  };

  const handleTerima = async (s: Setoran) => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/setoran/${s.id}/status`, { action: 'terima' });
      showToast(`Pengajuan ${s.kode} diterima`, 'success');
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTolak = async () => {
    if (!rejectTarget) return;
    if (!alasanTolak.trim()) return showToast('Alasan penolakan wajib diisi', 'error');
    setActionLoading(true);
    try {
      await api.patch(`/admin/setoran/${rejectTarget.id}/status`, {
        action: 'tolak',
        alasanTolak,
      });
      showToast(`Pengajuan ${rejectTarget.kode} ditolak`, 'success');
      setRejectTarget(null);
      setAlasanTolak('');
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleScanResult = async (code: string) => {
    try {
      const { data } = await api.post<Setoran>(`/admin/setoran/scan/${encodeURIComponent(code)}`);
      setScanOpen(false);
      showToast(`QR transaksi ${data.kode} berhasil discan`, 'success');
      load();
      router.push(`/admin/setoran/${data.id}/verifikasi`);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Pengajuan</h1>
        <button
          onClick={() => setScanOpen(true)}
          className="rounded-lg bg-functional-green px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          📷 Scan QR
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusSetoran | '')}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={metode}
          onChange={(e) => setMetode(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Semua Metode</option>
          <option value="ANTAR_SENDIRI">Antar Sendiri</option>
          <option value="DIJEMPUT">Dijemput</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kode / nama nasabah..."
          className="flex-1 min-w-[180px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Cari
        </button>
      </form>

      {loading ? (
        <CardSkeleton />
      ) : list.length === 0 ? (
        <EmptyState title="Tidak ada pengajuan" description="Belum ada data untuk filter ini." />
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
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.kode}</td>
                  <td className="px-4 py-3 text-gray-600">{s.user?.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.metode === 'ANTAR_SENDIRI' ? 'Antar Sendiri' : 'Dijemput'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-start gap-1">
                      <StatusBadge status={s.status} />
                      {(s.discanPada || s.status === 'SUDAH_DISCAN') && (
                        <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                          <span>✓</span> Sudah discan
                          {s.discanPada && (
                            <span className="text-blue-500">
                              ({new Date(s.discanPada).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(s.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setDetailTarget(s)}
                        className="text-xs font-medium text-gray-500 hover:text-gray-800"
                      >
                        Detail
                      </button>
                      {s.status === 'DIAJUKAN' && (
                        <>
                          <button
                            onClick={() => handleTerima(s)}
                            disabled={actionLoading}
                            className="text-xs font-medium text-functional-green hover:underline"
                          >
                            Terima
                          </button>
                          <button
                            onClick={() => setRejectTarget(s)}
                            className="text-xs font-medium text-red-500 hover:underline"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                      {['DITERIMA', 'SUDAH_DISCAN', 'DIVERIFIKASI'].includes(s.status) && (() => {
                        const isScanned = Boolean(s.discanPada || s.status === 'SUDAH_DISCAN' || s.status === 'DIVERIFIKASI');
                        if (!isScanned) {
                          return (
                            <span className="inline-flex items-center gap-1" title="Scan QR terlebih dahulu">
                              <button
                                type="button"
                                disabled
                                aria-disabled="true"
                                className="cursor-not-allowed text-xs font-medium text-gray-400 opacity-60"
                              >
                                Verifikasi
                              </button>
                              <span className="text-[10px] text-amber-600 font-normal">
                                (Belum scan)
                              </span>
                            </span>
                          );
                        }
                        return (
                          <button
                            onClick={() => router.push(`/admin/setoran/${s.id}/verifikasi`)}
                            className="text-xs font-medium text-functional-green hover:underline"
                          >
                            Verifikasi
                          </button>
                        );
                      })()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Detail */}
      <Modal
        open={!!detailTarget}
        title={detailTarget?.kode ?? ''}
        onClose={() => setDetailTarget(null)}
      >
        {detailTarget && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Nasabah</span>
              <span className="font-medium text-gray-800">{detailTarget.user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Metode</span>
              <span className="font-medium text-gray-800">
                {detailTarget.metode === 'ANTAR_SENDIRI' ? 'Antar Sendiri' : 'Dijemput'}
              </span>
            </div>
            {detailTarget.metode === 'DIJEMPUT' && (
              <div className="flex justify-between gap-4">
                <span className="shrink-0 text-gray-500">Alamat</span>
                <span className="text-right font-medium text-gray-800">
                  {detailTarget.addressSnapshot}
                </span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3">
              <p className="mb-2 font-medium text-gray-700">Item</p>
              {detailTarget.items?.map((item) => (
                <div key={item.id} className="flex justify-between py-1 text-gray-600">
                  <span>{item.namaKategoriSnapshot}</span>
                  <span>{item.beratPerkiraan} kg (perkiraan)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Tolak */}
      <Modal
        open={!!rejectTarget}
        title={`Tolak ${rejectTarget?.kode ?? ''}`}
        onClose={() => setRejectTarget(null)}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Alasan Penolakan
            </label>
            <textarea
              value={alasanTolak}
              onChange={(e) => setAlasanTolak(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Jelaskan alasan penolakan..."
            />
          </div>
          <button
            onClick={handleTolak}
            disabled={actionLoading}
            className="w-full rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {actionLoading ? 'Memproses...' : 'Tolak Pengajuan'}
          </button>
        </div>
      </Modal>

      {/* Modal Scan QR */}
      <Modal open={scanOpen} title="Scan QR Setoran" onClose={() => setScanOpen(false)}>
        <QrScanner onResult={handleScanResult} />
      </Modal>
    </div>
  );
}
