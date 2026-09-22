'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { api, getErrorMessage } from '@/lib/api';
import { Address } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { Modal, ConfirmModal } from '@/components/ui';
import { SisaSmileWatermark } from '@/components/sisa-smile-watermark';

export default function ProfilPage() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [label, setLabel] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    api
      .get<Address[]>('/addresses')
      .then((res) => setAddresses(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdd = () => {
    setEditing(null);
    setLabel('');
    setFullAddress('');
    setIsPrimary(addresses.length === 0);
    setModalOpen(true);
  };

  const openEdit = (a: Address) => {
    setEditing(a);
    setLabel(a.label ?? '');
    setFullAddress(a.fullAddress);
    setIsPrimary(a.isPrimary);
    setModalOpen(true);
  };

  const save = async () => {
    if (!fullAddress.trim()) return showToast('Alamat tidak boleh kosong', 'error');
    setSaving(true);
    try {
      const payload = { label: label || undefined, fullAddress, isPrimary };
      if (editing) {
        await api.patch(`/addresses/${editing.id}`, payload);
        showToast('Alamat berhasil diubah', 'success');
      } else {
        await api.post('/addresses', payload);
        showToast('Alamat berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/addresses/${deleteTarget.id}`);
      showToast('Alamat berhasil dihapus', 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'N';

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Format foto harus JPG, PNG, atau WebP', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      showToast('Ukuran foto terlalu besar. Maksimal 1 MB', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);
    void uploadProfilePhoto(file);
  };

  const uploadProfilePhoto = async (file: File) => {
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('foto', file);
      await api.patch('/profil/foto', formData);
      showToast('Foto profil berhasil diperbarui', 'success');
      await refreshUser();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
      setPhotoPreview(null);
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeProfilePhoto = async () => {
    try {
      await api.delete('/profil/foto');
      showToast('Foto profil berhasil dihapus', 'success');
      await refreshUser();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-7 sm:space-y-8">
      {/* ── 1. Page Header ── */}
      <div>
        <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
          Profil kamu
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Kelola informasi dan alamat yang digunakan untuk setoran.
        </p>
      </div>

      {/* ── 2. Decorative Personal Identity Card ── */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 sm:p-7 shadow-sm transition-all hover:shadow-md">
        {/* Subtle Brand Smile Watermark in Background */}
        <SisaSmileWatermark
          size={150}
          color="green"
          opacity={0.06}
          rotate={-8}
          className="absolute -right-8 -bottom-8 pointer-events-none select-none"
        />

        {/* Identity Row */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative flex h-14 w-14 min-w-[56px] min-h-[56px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-functional-green/20 bg-functional-green/10 text-xl font-bold text-functional-green shadow-xs">
            {user?.foto_url ? (
              <img
                src={user.foto_url}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              userInitial
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-functional-green text-[10px] font-bold text-white shadow-sm"
              title="Ubah foto profil"
            >
              +
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-sans text-xl font-semibold tracking-tight text-gray-900">
                {user?.name ?? 'Nasabah SI:)SA'}
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-functional-green/10 px-2.5 py-0.5 text-xs font-medium text-functional-green">
                <span className="h-1.5 w-1.5 rounded-full bg-functional-green animate-pulse" />
                Nasabah Aktif
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-400">
              Akun personal nasabah bank sampah
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="rounded-lg border border-functional-green/30 bg-functional-green/5 px-3 py-1.5 text-[11px] font-semibold text-functional-green disabled:opacity-60"
            >
              {uploadingPhoto ? 'Menyimpan...' : 'Ubah foto'}
            </button>
            {user?.foto_url && (
              <button
                type="button"
                onClick={removeProfilePhoto}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-500"
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* Labeled Information Columns (Kolom Informasi dengan Keterangan) */}
        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-5 border-t border-gray-100">
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Alamat Email
            </p>
            <p className="mt-1 text-sm font-medium text-gray-800 break-all">
              {user?.email ?? '-'}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Nomor Telepon
            </p>
            <p className="mt-1 text-sm font-medium text-gray-800">
              {user?.phone || '-'}
            </p>
          </div>
        </div>

        {/* Inner Saldo Poin Decorative Panel */}
        <div className="relative z-10 mt-4 rounded-xl border border-functional-green/15 bg-gradient-to-r from-functional-green/[0.07] via-functional-green/[0.03] to-transparent p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-functional-green shadow-xs border border-functional-green/20 text-base font-bold">
              :)
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Saldo Poin Kamu</p>
              <p className="text-lg font-bold text-gray-900 tracking-tight">
                {(user?.pointBalance ?? 0).toLocaleString('id-ID')}{' '}
                <span className="text-xs font-normal text-gray-500">poin</span>
              </p>
            </div>
          </div>
          <Link
            href="/hadiah"
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-functional-green shadow-xs border border-functional-green/20 transition-all hover:bg-functional-green hover:text-white hover:border-functional-green hover:shadow-sm"
          >
            Tukar Hadiah &rarr;
          </Link>
        </div>
      </div>

      {/* ── 3. Address Section ── */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Daftar Alamat
            </h2>
            {addresses.length > 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                {addresses.length}
              </span>
            )}
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 rounded-lg border border-functional-green/30 bg-functional-green/5 px-3 py-1.5 text-xs font-semibold text-functional-green transition-all hover:bg-functional-green hover:text-white hover:shadow-xs"
          >
            + Tambah Alamat
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
              <div className="h-4 w-1/4 rounded bg-gray-100" />
              <div className="h-3 w-3/4 rounded bg-gray-100" />
            </div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white/40 px-6 py-10 text-center">
            <p className="text-sm font-medium text-gray-700">Belum ada alamat tersimpan</p>
            <p className="mt-1 text-xs text-gray-400">
              Tambahkan alamat untuk memudahkan opsi penjemputan setoran sampahmu.
            </p>
            <button
              onClick={openAdd}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-functional-green hover:underline"
            >
              + Tambah Alamat Sekarang &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((a) => (
              <div
                key={a.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md"
              >
                {/* Left accent bar for primary address */}
                {a.isPrimary && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-functional-green rounded-l-2xl" />
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 tracking-tight">
                        {a.label || 'Alamat'}
                      </p>
                      {a.isPrimary && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-functional-green/10 px-2.5 py-0.5 text-[11px] font-semibold text-functional-green">
                          Utama
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                      {a.fullAddress}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => openEdit(a)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Ubah
                    </button>
                    <button
                      onClick={() => setDeleteTarget(a)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contextual guidance for primary address */}
        {addresses.length > 0 && (
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
            <span className="text-functional-green font-bold">ℹ</span>
            <span>Alamat utama akan digunakan secara otomatis saat kamu memilih opsi dijemput.</span>
          </div>
        )}
      </div>

      {/* ── Modal Add/Edit Address ── */}
      <Modal
        open={modalOpen}
        title={editing ? 'Ubah Alamat' : 'Tambah Alamat'}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Label <span className="text-gray-400">(opsional)</span>
            </label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Rumah, Kos, dll"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-functional-green focus:outline-none focus:ring-1 focus:ring-functional-green"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Alamat Lengkap</label>
            <textarea
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              rows={3}
              placeholder="Jalan, RT/RW, nomor rumah, patokan"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-functional-green focus:outline-none focus:ring-1 focus:ring-functional-green"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="accent-functional-green rounded"
            />
            Jadikan alamat utama
          </label>
          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-xl bg-functional-green py-2.5 text-sm font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </Modal>

      {/* ── Modal Confirm Delete ── */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus alamat ini?"
        description={deleteTarget?.fullAddress}
        confirmLabel="Ya, Hapus"
        danger
        onConfirm={remove}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
