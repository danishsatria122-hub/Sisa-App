'use client';

import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import { User } from '@/lib/types';
import { CardSkeleton, EmptyState, Modal, ConfirmModal } from '@/components/ui';
import { useToast } from '@/lib/toast-context';

export default function AdminNasabahPage() {
  const [list, setList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    api
      .get<User[]>('/admin/users')
      .then((res) => setList(res.data.filter((u) => u.role === 'NASABAH')))
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setModalOpen(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setName(u.name);
    setEmail(u.email);
    setPhone(u.phone ?? '');
    setPassword('');
    setModalOpen(true);
  };

  const save = async () => {
    if (!name.trim() || !email.trim()) return showToast('Nama dan email wajib diisi', 'error');
    if (!editing && password.length < 6) {
      return showToast('Password minimal 6 karakter', 'error');
    }
    setSaving(true);
    try {
      if (editing) {
        const payload: Record<string, unknown> = { name, email, phone: phone || undefined };
        if (password) payload.password = password;
        await api.patch(`/admin/users/${editing.id}`, payload);
        showToast('Nasabah berhasil diubah', 'success');
      } else {
        await api.post('/admin/users', {
          name,
          email,
          phone: phone || undefined,
          password,
          role: 'NASABAH',
        });
        showToast('Nasabah berhasil ditambahkan', 'success');
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
      await api.delete(`/admin/users/${deleteTarget.id}`);
      showToast('Nasabah berhasil dihapus', 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Nasabah</h1>
        <button
          onClick={openAdd}
          className="rounded-lg bg-functional-green px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          + Tambah Nasabah
        </button>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : list.length === 0 ? (
        <EmptyState title="Belum ada Nasabah terdaftar" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs text-gray-500">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">No. HP</th>
                <th className="px-4 py-3">Saldo Poin</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-gray-600">{u.phone ?? '-'}</td>
                  <td className="px-4 py-3 font-medium text-functional-green">
                    {u.pointBalance ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEdit(u)}
                        className="text-xs font-medium text-gray-500 hover:text-functional-green"
                      >
                        Ubah
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="text-xs font-medium text-gray-500 hover:text-red-500"
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
        title={editing ? 'Ubah Nasabah' : 'Tambah Nasabah'}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nama</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              No. HP <span className="text-gray-400">(opsional)</span>
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password {editing && <span className="text-gray-400">(kosongkan jika tidak diubah)</span>}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
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
        title={`Hapus Nasabah "${deleteTarget?.name}"?`}
        description="Tindakan ini akan menghapus akun beserta datanya secara permanen."
        confirmLabel="Ya, Hapus"
        danger
        onConfirm={remove}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
