'use client';

import Link from 'next/link';
import { SisaSmileIcon } from '@/components/sisa-logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFDF7] px-4 text-center">
      <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-xl max-w-md w-full">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-50">
          <SisaSmileIcon size={36} color="#FAEF8A" />
        </div>

        <h2 className="mt-5 font-fredoka text-3xl font-bold text-gray-900">
          404 - Halaman Tidak Ditemukan
        </h2>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          Halaman yang kamu cari mungkin telah dipindahkan atau belum tersedia di SI:)SA.
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-functional-green py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            <span>Kembali ke Beranda</span>
            <span className="text-xs">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
