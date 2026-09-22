'use client';

import { useEffect, useRef, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { Hadiah } from '@/lib/types';
import { CardSkeleton, EmptyState, Modal, ConfirmModal } from '@/components/ui';
import { useToast } from '@/lib/toast-context';

export default function AdminHadiahPage() {
  const [list, setList] = useState<Hadiah[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Hadiah | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Hadiah | null>(null);
  const [saving, setSaving] = useState(false);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingFotoUrl, setExistingFotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [poinDibutuhkan, setPoinDibutuhkan] = useState('');
  const [stok, setStok] = useState('');

  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    api
      .get<Hadiah[]>('/hadiah')
      .then((res) => setList(res.data))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearPhotoState = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFotoFile(null);
    setExistingFotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openAdd = () => {
    setEditing(null);
    setNama('');
    setDeskripsi('');
    setPoinDibutuhkan('');
    setStok('');
    clearPhotoState();
    setModalOpen(true);
  };

  const openEdit = (h: Hadiah) => {
    setEditing(h);
    setNama(h.nama);
    setDeskripsi(h.deskripsi ?? '');
    setPoinDibutuhkan(String(h.poinDibutuhkan));
    setStok(String(h.stok));
    clearPhotoState();
    setExistingFotoUrl(h.foto_url ?? null);
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Format foto harus JPG, PNG, atau WebP', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      showToast('Ukuran foto terlalu besar. Maksimal 2 MB', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setFotoFile(file);
  };

  const save = async () => {
    if (!nama.trim() || !poinDibutuhkan || stok === '') {
      return showToast('Nama, poin, dan stok wajib diisi', 'error');
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('nama', nama.trim());
      formData.append('deskripsi', deskripsi || '');
      formData.append('poinDibutuhkan', String(parseInt(poinDibutuhkan, 10)));
      formData.append('stok', String(parseInt(stok, 10)));
      if (fotoFile) formData.append('foto', fotoFile);

      if (editing) {
        await api.patch(`/admin/hadiah/${editing.id}`, formData);
        showToast('Hadiah berhasil diubah', 'success');
      } else {
        await api.post('/admin/hadiah', formData);
        showToast('Hadiah berhasil ditambahkan', 'success');
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
      await api.delete(`/admin/hadiah/${deleteTarget.id}`);
      showToast('Hadiah berhasil dihapus', 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Hadiah</h1>
        <button
          onClick={openAdd}
          className="rounded-lg bg-functional-green px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          + Tambah Hadiah
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState title="Belum ada hadiah" />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {list.map((h) => (
            <div
              key={h.id}
              className="flex flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex h-20 items-center justify-center overflow-hidden rounded-lg bg-digital-accent/40 text-3xl">
                {h.foto_url ? (
                  <img src={h.foto_url} alt={h.nama} className="h-full w-full object-cover" />
                ) : (
                  '🎁'
                )}
              </div>
              <p className="font-semibold text-gray-800">{h.nama}</p>
              <p className="mt-1 text-sm font-medium text-functional-green">
                {h.poinDibutuhkan} poin
              </p>
              <p className="text-xs text-gray-400">Stok: {h.stok}</p>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => openEdit(h)}
                  className="text-xs font-medium text-gray-500 hover:text-functional-green"
                >
                  Ubah
                </button>
                <button
                  onClick={() => setDeleteTarget(h)}
                  className="text-xs font-medium text-gray-500 hover:text-red-500"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Ubah Hadiah' : 'Tambah Hadiah'}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nama Hadiah</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Deskripsi <span className="text-gray-400">(opsional)</span>
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Poin Dibutuhkan
              </label>
              <input
                type="number"
                value={poinDibutuhkan}
                onChange={(e) => setPoinDibutuhkan(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Stok</label>
              <input
                type="number"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Foto Hadiah <span className="text-xs text-gray-400 font-normal">(Opsional, maks. 2 MB)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            {previewUrl ? (
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <img src={previewUrl} alt="Preview foto baru" className="h-16 w-16 rounded-md object-cover border border-gray-200" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-functional-green">Foto Baru Dipilih</p>
                  <p className="text-xs text-gray-500 truncate">{fotoFile?.name}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-medium text-functional-green hover:underline">
                    Ganti Foto
                  </button>
                  <button type="button" onClick={() => { if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(null); setFotoFile(null); if (fileInputRef.current) fileInputRef.current.value=''; }} className="text-xs text-red-500 hover:underline">
                    Batalkan
                  </button>
                </div>
              </div>
            ) : existingFotoUrl ? (
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <img src={existingFotoUrl} alt="Foto saat ini" className="h-16 w-16 rounded-md object-cover border border-gray-200" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-700">Foto Saat Ini</p>
                  <p className="text-xs text-gray-400">Tersimpan di server</p>
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                  Ganti Foto
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full rounded-lg border-2 border-dashed border-gray-200 p-4 text-xs font-medium text-gray-700 hover:border-functional-green/60 hover:bg-gray-50/50">
                + Pilih Foto (JPG, PNG, WebP)
              </button>
            )}
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-lg bg-functional-green py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        title={`Hapus hadiah "${deleteTarget?.nama}"?`}
        description="Jika hadiah sudah pernah ditukar Nasabah, sistem akan menolak dan menyarankan Anda set stok ke 0 saja."
        confirmLabel="Ya, Hapus"
        danger
        onConfirm={remove}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
