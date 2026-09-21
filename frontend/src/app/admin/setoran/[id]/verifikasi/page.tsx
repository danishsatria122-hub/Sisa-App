'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, getErrorMessage } from '@/lib/api';
import { KategoriSampah, Setoran } from '@/lib/types';
import { PageSpinner } from '@/components/ui';
import { StatusBadge } from '@/components/status-badge';
import { QrScanner } from '@/components/qr-scanner';
import { useToast } from '@/lib/toast-context';

interface DraftItem {
  id?: string;
  kategoriSampahId: string;
  beratReal: string;
}

export default function VerifikasiSetoranPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const [setoran, setSetoran] = useState<Setoran | null>(null);
  const [kategoriList, setKategoriList] = useState<KategoriSampah[]>([]);
  const [items, setItems] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [scanMatch, setScanMatch] = useState<'match' | 'mismatch' | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<Setoran>(`/admin/setoran/${id}`),
      api.get<KategoriSampah[]>('/admin/kategori-sampah'),
    ])
      .then(([setoranRes, kategoriRes]) => {
        setSetoran(setoranRes.data);
        setKategoriList(kategoriRes.data);
        setItems(
          setoranRes.data.items.map((item) => ({
            id: item.id,
            kategoriSampahId: item.kategoriSampahId,
            beratReal: item.beratReal != null ? String(item.beratReal) : String(item.beratPerkiraan),
          })),
        );
      })
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const kategoriMap = useMemo(() => new Map(kategoriList.map((k) => [k.id, k])), [kategoriList]);

  const { totalBerat, totalPoin } = useMemo(() => {
    let berat = 0;
    let poin = 0;
    for (const item of items) {
      const kategori = kategoriMap.get(item.kategoriSampahId);
      const beratReal = parseFloat(item.beratReal) || 0;
      berat += beratReal;
      if (kategori) poin += Math.round(beratReal * Number(kategori.poinPerKg));
    }
    return { totalBerat: berat, totalPoin: poin };
  }, [items, kategoriMap]);

  const addItem = () =>
    setItems([...items, { kategoriSampahId: kategoriList[0]?.id ?? '', beratReal: '' }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, patch: Partial<DraftItem>) =>
    setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const isScanned = Boolean(
    setoran?.discanPada || setoran?.status === 'SUDAH_DISCAN' || setoran?.status === 'DIVERIFIKASI',
  );

  const handleScanResult = async (code: string) => {
    try {
      const { data } = await api.post<Setoran>(`/admin/setoran/scan/${encodeURIComponent(code)}`);
      setSetoran(data);
      setScanMatch('match');
      showToast('QR berhasil divalidasi & status diperbarui', 'success');
    } catch (err) {
      setScanMatch('mismatch');
      showToast(getErrorMessage(err), 'error');
    }
  };

  const handleSelesaikan = async () => {
    if (!isScanned) {
      return showToast('Scan QR setoran terlebih dahulu', 'error');
    }
    if (items.length === 0) return showToast('Minimal harus ada 1 item', 'error');
    const valid = items.every((it) => it.kategoriSampahId && parseFloat(it.beratReal) >= 0);
    if (!valid) return showToast('Lengkapi kategori dan berat real setiap item', 'error');

    setSubmitting(true);
    try {
      await api.patch(`/admin/setoran/${id}/verifikasi`, {
        items: items.map((it) => ({
          id: it.id,
          kategoriSampahId: it.kategoriSampahId,
          beratReal: parseFloat(it.beratReal),
        })),
      });
      await api.patch(`/admin/setoran/${id}/selesaikan`);
      showToast('Verifikasi selesai, poin sudah masuk ke saldo Nasabah', 'success');
      router.push('/admin/setoran');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
      // Refresh current setoran state
      api
        .get<Setoran>(`/admin/setoran/${id}`)
        .then((res) => setSetoran(res.data))
        .catch(() => {});
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!setoran) return <p className="text-center text-gray-500">Setoran tidak ditemukan.</p>;

  if (!['DITERIMA', 'SUDAH_DISCAN', 'DIVERIFIKASI'].includes(setoran.status)) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700">
        Setoran ini berstatus <StatusBadge status={setoran.status} /> dan tidak bisa diverifikasi.
        Pastikan pengajuan sudah diterima terlebih dahulu.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">
        ← Kembali
      </button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Verifikasi — {setoran.kode}</h1>
          <p className="text-sm text-gray-500">Nasabah: {setoran.user?.name}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={setoran.status} />
          {isScanned && setoran.discanPada && (
            <span className="text-[11px] text-blue-600 font-medium">
              Discan {new Date(setoran.discanPada).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {!isScanned && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <div className="flex items-center gap-2 font-semibold">
            <span>⚠️</span> Scan QR Diperlukan
          </div>
          <p className="mt-1 text-xs text-amber-700">
            Setoran ini belum discan. Anda harus melakukan scan QR transaksi dari Nasabah sebelum dapat menyelesaikan verifikasi.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <button
          onClick={() => setShowScan((v) => !v)}
          className="text-sm font-medium text-functional-green hover:underline"
        >
          {showScan
            ? '▲ Sembunyikan area scan'
            : isScanned
            ? '▼ Scan ulang QR (opsional)'
            : '📷 Buka Scanner QR (Wajib scan sebelum verifikasi)'}
        </button>
        {showScan && (
          <div className="mt-4">
            <QrScanner onResult={handleScanResult} />
            {scanMatch === 'match' && (
              <p className="mt-3 text-center text-sm font-medium text-functional-green">
                ✓ QR cocok & transaksi berhasil divalidasi
              </p>
            )}
            {scanMatch === 'mismatch' && (
              <p className="mt-3 text-center text-sm font-medium text-red-500">
                ✕ QR tidak cocok dengan transaksi ini
              </p>
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Penimbangan Item</h2>
          <button
            onClick={addItem}
            className="text-sm font-medium text-functional-green hover:underline"
          >
            + Tambah Item
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-end gap-2 rounded-lg border border-gray-200 p-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-gray-600">Kategori</label>
                <select
                  value={item.kategoriSampahId}
                  onChange={(e) => updateItem(idx, { kategoriSampahId: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                >
                  {kategoriList.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama} {!k.aktif && '(nonaktif)'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-28">
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Berat Real (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={item.beratReal}
                  onChange={(e) => updateItem(idx, { beratReal: e.target.value })}
                  data-testid={`verifikasi-berat-${idx}`}
                  className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                />
              </div>
              <button
                onClick={() => removeItem(idx)}
                className="mb-1.5 text-red-400 hover:text-red-600"
                aria-label="Hapus item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t border-gray-100 pt-3 text-sm font-semibold text-gray-800">
          <span>Total</span>
          <span>
            {totalBerat.toFixed(1)} kg · {totalPoin} poin
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleSelesaikan}
          disabled={submitting || !isScanned}
          aria-disabled={submitting || !isScanned}
          className="w-full rounded-lg bg-functional-green py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? 'Memproses...'
            : !isScanned
            ? 'Scan QR Terlebih Dahulu'
            : 'Selesaikan Verifikasi'}
        </button>
        {!isScanned && (
          <p className="text-center text-xs text-amber-600">
            Tombol verifikasi terkunci sampai QR code setoran berhasil discan.
          </p>
        )}
      </div>
    </div>
  );
}
