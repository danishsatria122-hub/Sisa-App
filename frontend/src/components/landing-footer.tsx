'use client';

import Link from 'next/link';

import { SisaLogo } from './sisa-logo';

export function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          
          {/* Brand Info */}
          <div className="text-center sm:text-left">
            <Link href="/" className="inline-block transition hover:opacity-90">
              <SisaLogo variant="two-tone" height={30} />
            </Link>
            <p className="mt-1 text-xs font-medium text-gray-600">
              “Yang tersisa bukan berarti tidak bernilai.”
            </p>
            <p className="text-xs font-normal text-gray-400">A little smile for things left behind.</p>
          </div>

          {/* Copyright & Badges */}
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <p className="text-xs font-medium text-gray-400">
              © {new Date().getFullYear()} SI:)SA — Digital Waste Bank Platform.
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <Link href="/tentang-kami" className="transition-colors hover:text-functional-green">Tentang</Link>
              <span>•</span>
              <Link href="/#cara-kerja" className="transition-colors hover:text-functional-green">Cara Kerja</Link>
              <span>•</span>
              <Link href="/#kategori" className="transition-colors hover:text-functional-green">Kategori</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
