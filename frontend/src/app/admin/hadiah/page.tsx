'use client';

import { useEffect, useState } from 'react';
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

  const openAdd = () => {
    setEditing(null);
    setNama('');
    setDeskripsi('');
    setPoinDibutuhkan('');
    setStok('');
    setModalOpen(true);
  };

  const openEdit = (h: Hadiah) => {
    setEditing(h);
    setNama(h.nama);
    setDeskripsi(h.deskripsi ?? '');
    setPoinDibutuhkan(String(h.poinDibutuhkan));
    setStok(String(h.stok));
    setModalOpen(true);
  };

  const save = async () => {
    if (!nama.trim() || !poinDibutuhkan || stok === '') {
      return showToast('Nama, poin, dan stok wajib diisi', 'error');
    }
    setSaving(true);
    try {
      const payload = {
        nama,
        deskripsi: deskripsi || undefined,
        poinDibutuhkan: parseInt(poinDibutuhkan, 10),
        stok: parseInt(stok, 10),
      };
      if (editing) {
        await api.patch(`/admin/hadiah/${editing.id}`, payload);
        showToast('Hadiah berhasil diubah', 'success');
      } else {
        await api.post('/admin/hadiah', payload);
        showToast('Hadiah berhasil ditambahkan', 'success');
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
              <div className="mb-3 flex h-20 items-center justify-center rounded-lg bg-digital-accent/40 text-3xl">
                🎁
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
          <p className="text-xs text-gray-400">
            Upload gambar belum didukung pada MVP ini — tampilan memakai ikon placeholder 🎁.
          </p>
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
