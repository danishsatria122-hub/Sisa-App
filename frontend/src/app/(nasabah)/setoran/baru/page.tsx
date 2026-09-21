'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, getErrorMessage } from '@/lib/api';
import { Address, KategoriSampah, MetodeSetoran } from '@/lib/types';
import { useToast } from '@/lib/toast-context';
import { PageSpinner } from '@/components/ui';
import { CategoryThumb } from '@/components/category-thumb';

interface DraftItem {
  kategoriSampahId: string;
  beratPerkiraan: string;
}

export default function SetoranBaruPage() {
  const [step, setStep] = useState(1);
  const [metode, setMetode] = useState<MetodeSetoran | null>(null);
  const [addressId, setAddressId] = useState('');
  const [tanggalPickup, setTanggalPickup] = useState('');
  const [waktuMulai, setWaktuMulai] = useState('');
  const [waktuSelesai, setWaktuSelesai] = useState('');
  const [items, setItems] = useState<DraftItem[]>([{ kategoriSampahId: '', beratPerkiraan: '' }]);

  const [kategoriList, setKategoriList] = useState<KategoriSampah[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  // Fetch kategori list — extracted so we can re-call on focus
  const fetchKategori = useCallback(() => {
    return api.get<KategoriSampah[]>('/kategori-sampah').then((res) => {
      setKategoriList(res.data);
    });
  }, []);

  useEffect(() => {
    setLoadingData(true);
    Promise.all([fetchKategori(), api.get<Address[]>('/addresses')])
      .then(([, addressRes]) => {
        setAddresses(addressRes.data);
        const primary = addressRes.data.find((a) => a.isPrimary);
        if (primary) setAddressId(primary.id);
      })
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoadingData(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch categories whenever the tab becomes visible again so that an
  // admin photo update is reflected without a full page reload.
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchKategori().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchKategori]);

  if (loadingData) return <PageSpinner />;

  const addItem = () => setItems([...items, { kategoriSampahId: '', beratPerkiraan: '' }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, patch: Partial<DraftItem>) =>
    setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const goNext = () => {
    if (step === 1 && !metode) {
      showToast('Pilih metode setoran terlebih dahulu', 'error');
      return;
    }
    if (step === 2 && metode === 'DIJEMPUT') {
      if (!addressId) return showToast('Pilih alamat penjemputan', 'error');
      if (!tanggalPickup || !waktuMulai || !waktuSelesai) {
        return showToast('Lengkapi tanggal dan rentang waktu pickup', 'error');
      }
    }
    if (step === 3) {
      const valid = items.every((it) => it.kategoriSampahId && parseFloat(it.beratPerkiraan) > 0);
      if (!valid) return showToast('Lengkapi kategori dan berat perkiraan setiap item', 'error');
    }
    // Lewati step alamat (2) kalau metode Antar Sendiri
    if (step === 1 && metode === 'ANTAR_SENDIRI') return setStep(3);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === 3 && metode === 'ANTAR_SENDIRI') return setStep(1);
    setStep((s) => Math.max(1, s - 1));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      await api.post('/setoran', {
        metode,
        items: items.map((it) => ({
          kategoriSampahId: it.kategoriSampahId,
          beratPerkiraan: parseFloat(it.beratPerkiraan),
        })),
        ...(metode === 'DIJEMPUT'
          ? {
              addressId,
              tanggalPickup,
              waktuPickupMulai: waktuMulai,
              waktuPickupSelesai: waktuSelesai,
            }
          : {}),
      });
      showToast('Pengajuan setoran berhasil dibuat!', 'success');
      router.push('/setoran');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = ['Metode', metode === 'DIJEMPUT' ? 'Jadwal' : null, 'Item', 'Review'].filter(
    Boolean,
  ) as string[];
  const displayStepIndex = metode === 'ANTAR_SENDIRI' && step >= 3 ? step - 1 : step;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Pengajuan Setoran</h1>

      {/* Stepper indicator */}
      <div className="flex items-center gap-2">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                displayStepIndex - 1 >= i
                  ? 'bg-functional-green text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            <span className="hidden text-xs text-gray-500 sm:inline">{label}</span>
            {i < stepLabels.length - 1 && <div className="h-px flex-1 bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-gray-800">Pilih metode setoran</h2>
            <button
              onClick={() => setMetode('ANTAR_SENDIRI')}
              className={`w-full rounded-xl border-2 p-4 text-left transition ${
                metode === 'ANTAR_SENDIRI'
                  ? 'border-functional-green bg-functional-green/5'
                  : 'border-gray-200'
              }`}
            >
              <p className="font-medium text-gray-800">🚶 Antar Sendiri</p>
              <p className="text-sm text-gray-500">Bawa sampah langsung ke Bank Sampah.</p>
            </button>
            <button
              onClick={() => setMetode('DIJEMPUT')}
              className={`w-full rounded-xl border-2 p-4 text-left transition ${
                metode === 'DIJEMPUT'
                  ? 'border-functional-green bg-functional-green/5'
                  : 'border-gray-200'
              }`}
            >
              <p className="font-medium text-gray-800">🚚 Dijemput</p>
              <p className="text-sm text-gray-500">Petugas datang menjemput ke alamat Anda.</p>
            </button>
          </div>
        )}

        {step === 2 && metode === 'DIJEMPUT' && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-800">Jadwal penjemputan</h2>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Alamat</label>
              {addresses.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Anda belum punya alamat tersimpan. Tambahkan di halaman{' '}
                  <a href="/profil" className="text-functional-green underline">
                    Profil
                  </a>{' '}
                  terlebih dahulu.
                </p>
              ) : (
                <select
                  value={addressId}
                  onChange={(e) => setAddressId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Pilih alamat</option>
                  {addresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label ? `${a.label} — ` : ''}
                      {a.fullAddress}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tanggal</label>
              <input
                type="date"
                value={tanggalPickup}
                onChange={(e) => setTanggalPickup(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Dari jam</label>
                <input
                  type="time"
                  value={waktuMulai}
                  onChange={(e) => setWaktuMulai(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Sampai jam
                </label>
                <input
                  type="time"
                  value={waktuSelesai}
                  onChange={(e) => setWaktuSelesai(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Item sampah</h2>
              <button
                onClick={addItem}
                className="text-sm font-medium text-functional-green hover:underline"
              >
                + Tambah item
              </button>
            </div>

            {items.map((item, idx) => {
              const selectedKategori = kategoriList.find((k) => k.id === item.kategoriSampahId);
              return (
                <div key={idx} className="rounded-lg border border-gray-200 p-3 space-y-2">
                  {/* Thumbnail + fields row */}
                  <div className="flex items-end gap-2">
                    {/* Category photo — updates as user picks from select */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="mb-1 block text-xs font-medium text-gray-600 invisible">&#8203;</span>
                      <CategoryThumb
                        src={selectedKategori?.foto_url}
                        name={selectedKategori?.nama ?? 'Kategori'}
                        size={40}
                      />
                    </div>

                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-gray-600">Kategori</label>
                      <select
                        value={item.kategoriSampahId}
                        onChange={(e) => updateItem(idx, { kategoriSampahId: e.target.value })}
                        data-testid={`item-kategori-${idx}`}
                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                      >
                        <option value="">Pilih kategori</option>
                        {kategoriList.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.nama} ({k.poinPerKg} poin/kg)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-28">
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Berat (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={item.beratPerkiraan}
                        onChange={(e) => updateItem(idx, { beratPerkiraan: e.target.value })}
                        data-testid={`item-berat-${idx}`}
                        className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                      />
                    </div>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="mb-1.5 text-red-400 hover:text-red-600"
                        aria-label="Hapus item"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {kategoriList.length === 0 && (
              <p className="text-sm text-amber-600">
                Belum ada kategori sampah aktif. Hubungi Admin.
              </p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-800">Review pengajuan</h2>
            <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Metode</span>
                <span className="font-medium text-gray-800">
                  {metode === 'ANTAR_SENDIRI' ? 'Antar Sendiri' : 'Dijemput'}
                </span>
              </div>
              {metode === 'DIJEMPUT' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Alamat</span>
                    <span className="text-right font-medium text-gray-800">
                      {addresses.find((a) => a.id === addressId)?.fullAddress}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Jadwal</span>
                    <span className="font-medium text-gray-800">
                      {tanggalPickup}, {waktuMulai}–{waktuSelesai}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => {
                const kategori = kategoriList.find((k) => k.id === item.kategoriSampahId);
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2 text-sm"
                  >
                    {/* Category photo in review */}
                    <CategoryThumb
                      src={kategori?.foto_url}
                      name={kategori?.nama ?? 'Kategori'}
                      size={48}
                    />
                    <span className="flex-1 text-gray-700">{kategori?.nama}</span>
                    <span className="font-medium text-gray-800">
                      {item.beratPerkiraan} kg (perkiraan)
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400">
              Poin final akan dihitung Admin berdasarkan berat real saat verifikasi.
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            onClick={goBack}
            disabled={step === 1}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-0"
          >
            ← Kembali
          </button>
          {step < 4 ? (
            <button
              onClick={goNext}
              className="rounded-lg bg-functional-green px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Lanjut →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="rounded-lg bg-functional-green px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              {submitting ? 'Mengirim...' : 'Kirim Pengajuan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
