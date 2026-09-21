'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/setoran', label: 'Kelola Pengajuan', icon: '♻️' },
  { href: '/admin/kategori', label: 'Kategori Sampah', icon: '🗂️' },
  { href: '/admin/hadiah', label: 'Hadiah', icon: '🎁' },
  { href: '/admin/penukaran', label: 'Penukaran', icon: '🔁' },
  { href: '/admin/nasabah', label: 'Nasabah', icon: '👥' },
  { href: '/admin/laporan', label: 'Laporan Bulanan', icon: '📈' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <>
      <div className="mb-6 px-2">
        <Link href="/" className="font-logo text-2xl text-functional-green" title="Kembali ke Beranda">
          SI:)SA
        </Link>
        <p className="mt-0.5 text-xs text-gray-400">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              pathname.startsWith(item.href)
                ? 'bg-functional-green/10 text-functional-green'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-100 pt-3">
        <p className="px-2 text-sm text-gray-500">{user?.name}</p>
        <button
          onClick={logout}
          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Keluar
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="no-print fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-gray-100 bg-white p-4 md:flex">
        {content}
      </aside>

      <div className="no-print sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 md:hidden">
        <Link href="/" className="font-logo text-xl text-functional-green" title="Kembali ke Beranda">
          SI:)SA
        </Link>
        <button className="text-2xl text-gray-600" onClick={() => setMobileOpen((v) => !v)}>
          ☰
        </button>
      </div>
      {mobileOpen && (
        <div className="no-print flex flex-col gap-1 border-b border-gray-100 bg-white p-4 md:hidden">
          {content}
        </div>
      )}
    </>
  );
}
