'use client';

import { useEffect, useState, useRef } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { KategoriSampah } from '@/lib/types';
import { CardSkeleton, EmptyState, Modal, ConfirmModal } from '@/components/ui';
import { useToast } from '@/lib/toast-context';

export default function AdminKategoriPage() {
  const [list, setList] = useState<KategoriSampah[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<KategoriSampah | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KategoriSampah | null>(null);
  const [saving, setSaving] = useState(false);

  const [nama, setNama] = useState('');
  const [hargaPerKg, setHargaPerKg] = useState('');
  const [poinPerKg, setPoinPerKg] = useState('');
  const [aktif, setAktif] = useState(true);

  // Photo state
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingFotoUrl, setExistingFotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    api
      .get<KategoriSampah[]>('/api/v1/kategori-sampah?all=true')
      .then((res) => setList(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const clearPhotoState = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFotoFile(null);
    setExistingFotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openAdd = () => {
    setEditing(null);
    setNama('');
    setHargaPerKg('');
    setPoinPerKg('');
    setAktif(true);
    clearPhotoState();
    setModalOpen(true);
  };

  const openEdit = (k: KategoriSampah) => {
    setEditing(k);
    setNama(k.nama);
    setHargaPerKg(String(k.hargaPerKg));
    setPoinPerKg(String(k.poinPerKg));
    setAktif(k.aktif);
    clearPhotoState();
    setExistingFotoUrl(k.foto_url ?? null);
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: JPEG, PNG, WebP
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Format foto harus berupa JPG, PNG, atau WebP', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size: 2MB
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      showToast('Ukuran foto terlalu besar. Maksimal 2 MB', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const newUrl = URL.createObjectURL(file);
    setPreviewUrl(newUrl);
    setFotoFile(file);
  };

  const removeSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFotoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const save = async () => {
    if (!nama.trim() || !hargaPerKg || !poinPerKg) {
      return showToast('Semua field wajib diisi', 'error');
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('nama', nama.trim());
      formData.append('hargaPerKg', hargaPerKg);
      formData.append('poinPerKg', poinPerKg);
      formData.append('aktif', String(aktif));

      if (fotoFile) {
        formData.append('foto', fotoFile);
      }

      if (editing) {
        await api.put(`/api/v1/kategori-sampah/${editing.id}`, formData);
        showToast('Kategori berhasil diubah', 'success');
      } else {
        await api.post('/api/v1/kategori-sampah', formData);
        showToast('Kategori berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      clearPhotoState();
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
      await api.delete(`/api/v1/kategori-sampah/${deleteTarget.id}`);
      showToast('Kategori berhasil dihapus', 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Kategori Sampah</h1>
        <button
          onClick={openAdd}
          className="rounded-lg bg-functional-green px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
        >
          + Tambah Kategori
        </button>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : list.length === 0 ? (
        <EmptyState title="Belum ada kategori sampah" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs text-gray-500">
              <tr>
                <th className="px-4 py-3 w-14">Foto</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Harga/kg</th>
                <th className="px-4 py-3">Poin/kg</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((k) => (
                <tr key={k.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-2.5">
                    {k.foto_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={k.foto_url}
                        alt={k.nama}
                        className="h-10 w-10 rounded-lg object-cover border border-gray-100 bg-gray-50"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400 text-xs border border-gray-100">
                        <svg className="w-5 h-5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{k.nama}</td>
                  <td className="px-4 py-3 text-gray-600">
                    Rp{Number(k.hargaPerKg).toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{k.poinPerKg}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        k.aktif ? 'bg-functional-green/10 text-functional-green' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {k.aktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => openEdit(k)}
                        className="text-xs font-medium text-gray-500 hover:text-functional-green transition-colors"
                      >
                        Ubah
                      </button>
                      <button
                        onClick={() => setDeleteTarget(k)}
                        className="text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Ubah Kategori' : 'Tambah Kategori'}
        onClose={() => {
          setModalOpen(false);
          clearPhotoState();
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nama Kategori</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-functional-green focus:outline-none focus:ring-1 focus:ring-functional-green"
              placeholder="Botol Plastik PET"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Harga/kg (Rp)</label>
              <input
                type="number"
                value={hargaPerKg}
                onChange={(e) => setHargaPerKg(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-functional-green focus:outline-none focus:ring-1 focus:ring-functional-green"
                placeholder="3000"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Poin/kg</label>
              <input
                type="number"
                value={poinPerKg}
                onChange={(e) => setPoinPerKg(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-functional-green focus:outline-none focus:ring-1 focus:ring-functional-green"
                placeholder="10"
              />
            </div>
          </div>

          {/* Photo Upload Field */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Foto Kategori <span className="text-xs text-gray-400 font-normal">(Opsional, maks. 2 MB)</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            {previewUrl ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview foto baru"
                  className="h-16 w-16 rounded-md object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-functional-green">Foto Baru Dipilih</p>
                  <p className="text-xs text-gray-500 truncate">{fotoFile?.name}</p>
                  <p className="text-[10px] text-gray-400">
                    {fotoFile ? (fotoFile.size / 1024).toFixed(0) : 0} KB
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium text-functional-green hover:underline"
                  >
                    Ganti Foto
                  </button>
                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            ) : existingFotoUrl ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={existingFotoUrl}
                  alt="Foto saat ini"
                  className="h-16 w-16 rounded-md object-cover border border-gray-200"
                />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-700">Foto Saat Ini</p>
                  <p className="text-xs text-gray-400">Tersimpan di server</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                >
                  Ganti Foto
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-functional-green/60 hover:bg-gray-50/50 transition-colors cursor-pointer"
              >
                <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-medium text-gray-700">+ Pilih Foto (JPG, PNG, WebP)</span>
                <span className="text-[11px] text-gray-400 mt-0.5">Maksimal 2 MB</span>
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={aktif}
              onChange={(e) => setAktif(e.target.checked)}
              className="rounded border-gray-300 text-functional-green focus:ring-functional-green"
            />
            Aktif (tersedia untuk pengajuan baru)
          </label>

          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-lg bg-functional-green py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 transition-colors shadow-sm"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        title={`Hapus kategori "${deleteTarget?.nama}"?`}
        description="Jika kategori sudah pernah dipakai transaksi, sistem akan menolak dan menyarankan Anda menonaktifkan saja."
        confirmLabel="Ya, Hapus"
        danger
        onConfirm={remove}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
