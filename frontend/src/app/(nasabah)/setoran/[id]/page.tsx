'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, getErrorMessage } from '@/lib/api';
import { Setoran } from '@/lib/types';
import { PageSpinner, ConfirmModal } from '@/components/ui';
import { StatusBadge } from '@/components/status-badge';
import { useToast } from '@/lib/toast-context';

const QR_VISIBLE_STATUSES = ['DIAJUKAN', 'DITERIMA', 'DIVERIFIKASI'];

export default function DetailSetoranPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const [setoran, setSetoran] = useState<Setoran | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get<Setoran>(`/setoran/${id}`)
      .then((res) => setSetoran(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (setoran && QR_VISIBLE_STATUSES.includes(setoran.status)) {
      api
        .get(`/setoran/${id}/qr`)
        .then((res) => setQrImage(res.data.qrImageBase64))
        .catch(() => {});
    }
  }, [setoran, id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.delete(`/setoran/${id}`);
      showToast('Pengajuan berhasil dibatalkan', 'success');
      setShowCancelModal(false);
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!setoran) return <p className="text-center text-gray-500">Setoran tidak ditemukan.</p>;

  const isVerified = ['DIVERIFIKASI', 'SELESAI'].includes(setoran.status);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">
        ← Kembali
      </button>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-bold text-gray-800">{setoran.kode}</p>
            <p className="text-sm text-gray-500">
              {new Date(setoran.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <StatusBadge status={setoran.status} />
        </div>

        {setoran.status === 'DITOLAK' && setoran.alasanTolak && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <span className="font-medium">Alasan ditolak:</span> {setoran.alasanTolak}
          </div>
        )}

        <div className="mt-4 space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium text-gray-800">Metode:</span>{' '}
            {setoran.metode === 'ANTAR_SENDIRI' ? 'Antar Sendiri' : 'Dijemput'}
          </p>
          {setoran.metode === 'DIJEMPUT' && (
            <>
              <p>
                <span className="font-medium text-gray-800">Alamat:</span>{' '}
                {setoran.addressSnapshot}
              </p>
              <p>
                <span className="font-medium text-gray-800">Jadwal:</span>{' '}
                {setoran.tanggalPickup &&
                  new Date(setoran.tanggalPickup).toLocaleDateString('id-ID')}
                , {setoran.waktuPickupMulai}–{setoran.waktuPickupSelesai}
              </p>
            </>
          )}
        </div>
      </div>

      {qrImage && (
        <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="mb-3 text-sm font-medium text-gray-600">
            Tunjukkan QR ini saat serah-terima
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrImage} alt="QR Code Setoran" className="h-48 w-48" />
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-800">Item Sampah</h2>
        <div className="space-y-2">
          {setoran.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-gray-50 py-2 text-sm last:border-0"
            >
              <div>
                <p className="font-medium text-gray-800">{item.namaKategoriSnapshot}</p>
                <p className="text-xs text-gray-500">
                  Perkiraan: {item.beratPerkiraan} kg
                  {isVerified && item.beratReal != null && ` · Real: ${item.beratReal} kg`}
                </p>
              </div>
              {isVerified && item.poinDidapat != null && (
                <span className="font-semibold text-functional-green">
                  +{item.poinDidapat} poin
                </span>
              )}
            </div>
          ))}
        </div>

        {isVerified && (
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-3 text-sm font-semibold text-gray-800">
            <span>Total</span>
            <span>
              {setoran.totalBeratReal} kg · {setoran.totalPoin} poin
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {setoran.status === 'DIAJUKAN' && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="flex-1 rounded-lg border border-red-200 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"
          >
            Batalkan Pengajuan
          </button>
        )}
        {setoran.status === 'SELESAI' && (
          <button
            onClick={() => router.push(`/setoran/${id}/nota`)}
            className="flex-1 rounded-lg bg-functional-green py-2.5 text-sm font-semibold text-white hover:bg-green-700"
          >
            Lihat Nota
          </button>
        )}
      </div>

      <ConfirmModal
        open={showCancelModal}
        title="Batalkan pengajuan?"
        description="Tindakan ini tidak dapat dibatalkan. Anda perlu membuat pengajuan baru jika ingin menyetor lagi."
        confirmLabel={cancelling ? 'Membatalkan...' : 'Ya, Batalkan'}
        danger
        onConfirm={handleCancel}
        onCancel={() => setShowCancelModal(false)}
      />
    </div>
  );
}
