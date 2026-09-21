'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { SisaSmileIcon } from '@/components/sisa-logo';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for debugging
    console.error('Unhandled App Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFDF7] px-4 text-center">
      <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-xl max-w-md w-full">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
          <SisaSmileIcon size={36} color="#4CAF50" />
        </div>

        <h2 className="mt-5 font-fredoka text-2xl font-bold text-gray-900">
          Oops, terjadi kendala kecil!
        </h2>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          Jangan khawatir, tim SI:)SA siap membantu memulihkan halaman ini.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={() => reset()}
            className="w-full rounded-2xl bg-functional-green py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            Coba Muat Ulang :)
          </button>
          <Link
            href="/"
            className="w-full rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
