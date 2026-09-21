'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { api, getErrorMessage } from '@/lib/api';
import { DashboardNasabah, Hadiah, Setoran } from '@/lib/types';
import { useToast } from '@/lib/toast-context';
import { useAuth } from '@/lib/auth-context';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function greetingCopy(name: string | undefined): { greeting: string; sub: string } {
  const firstName = name?.split(' ')[0] ?? 'kamu';
  const hour = new Date().getHours();
  const time = hour < 11 ? 'pagi' : hour < 15 ? 'siang' : hour < 18 ? 'sore' : 'malam';
  return {
    greeting: `Hai, ${firstName} :)`,
    sub:
      hour < 12
        ? 'Semoga harimu menyenangkan. Yuk lihat aktivitasmu.'
        : hour < 17
        ? 'Ada sampah yang bisa kamu beri nilai hari ini?'
        : 'Selamat malam. Ini ringkasan aktivitasmu.',
  };
}

const STATUS_LABEL: Record<string, string> = {
  DIAJUKAN: 'Diajukan',
  DITERIMA: 'Diterima',
  DIVERIFIKASI: 'Diverifikasi',
  SELESAI: 'Selesai',
  DITOLAK: 'Ditolak',
  DIBATALKAN: 'Dibatalkan',
  DIPROSES: 'Diproses',
};

const STATUS_DOT: Record<string, string> = {
  DIAJUKAN: 'bg-yellow-400',
  DITERIMA: 'bg-teal-400',
  DIVERIFIKASI: 'bg-teal-400',
  SELESAI: 'bg-functional-green',
  DITOLAK: 'bg-red-400',
  DIBATALKAN: 'bg-gray-300',
  DIPROSES: 'bg-soft-green',
};

const STATUS_TEXT: Record<string, string> = {
  DIAJUKAN: 'text-yellow-700',
  DITERIMA: 'text-teal-700',
  DIVERIFIKASI: 'text-teal-700',
  SELESAI: 'text-functional-green',
  DITOLAK: 'text-red-600',
  DIBATALKAN: 'text-gray-400',
  DIPROSES: 'text-green-700',
};

// ─── Subcomponents ──────────────────────────────────────────────────────────

/** Animated progress bar — width animates on mount */
function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 120);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full bg-functional-green transition-all duration-700 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

/** Skeleton pulse block */
function Pulse({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-100 ${className ?? ''}`} />;
}

/** Interactive transaction row */
function TransactionRow({ s }: { s: Setoran }) {
  const weight =
    s.totalBeratReal != null && s.totalBeratReal > 0 ? `${s.totalBeratReal} kg` : null;
  const categoryNames = s.items
    ?.slice(0, 2)
    .map((i) => i.namaKategoriSnapshot)
    .join(', ');
  const extraItems = (s.items?.length ?? 0) - 2;

  // Real data only: compose meta line concisely
  const metaParts: string[] = [formatDate(s.createdAt)];
  if (weight) {
    metaParts.push(weight);
  } else if (categoryNames) {
    metaParts.push(extraItems > 0 ? `${categoryNames} +${extraItems} lagi` : categoryNames);
  }

  return (
    <Link
      href={`/setoran/${s.id}`}
      className="group flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3.5 sm:px-5 sm:py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md"
    >
      {/* Left: code + meta */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800 tracking-tight truncate group-hover:text-gray-900">
          {s.kode}
        </p>
        <p className="mt-0.5 text-xs text-gray-400">
          {metaParts.join(' · ')}
        </p>
      </div>

      {/* Right: points + status + arrow */}
      <div className="flex shrink-0 items-center gap-4 sm:gap-6">
        {s.totalPoin != null && s.totalPoin > 0 && (
          <span className="text-sm font-semibold text-functional-green">
            +{s.totalPoin} :)
          </span>
        )}
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s.status] ?? 'bg-gray-300'}`} />
          <span className={STATUS_TEXT[s.status] ?? 'text-gray-500'}>
            {STATUS_LABEL[s.status] ?? s.status}
          </span>
          <span className="text-gray-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-functional-green">
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [dashData, setDashData] = useState<DashboardNasabah | null>(null);
  const [hadiahList, setHadiahList] = useState<Hadiah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshUser();
    Promise.all([
      api.get<DashboardNasabah>('/dashboard'),
      api.get<Hadiah[]>('/hadiah'),
    ])
      .then(([dashRes, hadiahRes]) => {
        setDashData(dashRes.data);
        setHadiahList(hadiahRes.data ?? []);
      })
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Computed: next reward to aim for ──────────────────────────────────────
  const saldo = dashData?.saldoPoin ?? 0;
  const availableRewards = hadiahList.filter(
    (h) => h.statusStok !== 'HABIS' && h.stok > 0,
  );
  // Reward with smallest poinDibutuhkan > saldo (closest next target)
  const nextReward = availableRewards
    .filter((h) => h.poinDibutuhkan > saldo)
    .sort((a, b) => a.poinDibutuhkan - b.poinDibutuhkan)[0] ?? null;
  // Reward user can already afford
  const affordableReward = availableRewards
    .filter((h) => h.poinDibutuhkan <= saldo)
    .sort((a, b) => b.poinDibutuhkan - a.poinDibutuhkan)[0] ?? null;

  const { greeting, sub } = greetingCopy(user?.name);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Greeting skeleton */}
        <div className="space-y-2">
          <Pulse className="h-7 w-48" />
          <Pulse className="h-4 w-72" />
        </div>
        {/* Saldo skeleton */}
        <div className="space-y-3">
          <Pulse className="h-4 w-24" />
          <Pulse className="h-14 w-44" />
          <Pulse className="h-2 w-full max-w-2xl" />
          <Pulse className="h-4 w-60" />
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-3 max-w-2xl gap-4 py-4">
          <Pulse className="h-10 w-24" />
          <Pulse className="h-10 w-24" />
          <Pulse className="h-10 w-24" />
        </div>
        {/* Action skeleton */}
        <Pulse className="h-20 w-full rounded-2xl" />
        {/* Transactions skeleton */}
        <div className="space-y-3">
          <Pulse className="h-4 w-32" />
          <Pulse className="h-16 w-full rounded-xl" />
          <Pulse className="h-16 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-9">

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. GREETING                                                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div>
        <h1 className="font-sans text-2xl font-semibold tracking-tight text-gray-900">
          {greeting}
        </h1>
        <p className="mt-1 text-sm text-gray-400">{sub}</p>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. POINT BALANCE & REWARD PROGRESS                            */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Saldo kamu
          </p>

          <div className="mt-1.5 flex items-baseline gap-2">
            <span
              data-testid="saldo-poin-value"
              className="font-sans text-5xl sm:text-6xl font-semibold tracking-tight text-gray-900"
            >
              {saldo.toLocaleString('id-ID')}
            </span>
            <span className="text-xl sm:text-2xl font-normal text-functional-green">:)</span>
          </div>
        </div>

        {/* Reward Progress — directly associated, balanced width */}
        <div className="w-full max-w-2xl space-y-2 pt-1">
          {nextReward ? (
            <>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  <span className="font-semibold text-gray-800">{saldo.toLocaleString('id-ID')}</span>
                  {' / '}
                  <span>{nextReward.poinDibutuhkan.toLocaleString('id-ID')} poin</span>
                </span>
                <span className="font-medium text-gray-600 truncate ml-2 max-w-[220px]">
                  {nextReward.nama}
                </span>
              </div>
              <ProgressBar value={saldo} max={nextReward.poinDibutuhkan} />
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                <p>
                  Kurang{' '}
                  <span className="font-semibold text-gray-700">
                    {(nextReward.poinDibutuhkan - saldo).toLocaleString('id-ID')} poin
                  </span>{' '}
                  lagi untuk{' '}
                  <Link href="/hadiah" className="text-functional-green hover:underline font-medium">
                    {nextReward.nama}
                  </Link>
                  .
                </p>
                <Link
                  href="/hadiah"
                  className="inline-flex items-center gap-1 text-xs font-medium text-functional-green hover:underline shrink-0"
                >
                  Lihat katalog &rarr;
                </Link>
              </div>
            </>
          ) : affordableReward ? (
            <>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-medium text-functional-green">Poinmu cukup! :)</span>
                <span className="font-medium text-gray-600 truncate ml-2 max-w-[220px]">
                  {affordableReward.nama}
                </span>
              </div>
              <ProgressBar value={1} max={1} />
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                <p>
                  Kamu sudah bisa menukar{' '}
                  <Link href="/hadiah" className="text-functional-green hover:underline font-medium">
                    {affordableReward.nama}
                  </Link>{' '}
                  dan hadiah lainnya.
                </p>
                <Link
                  href="/hadiah"
                  className="inline-flex items-center gap-1 text-xs font-medium text-functional-green hover:underline shrink-0"
                >
                  Lihat katalog &rarr;
                </Link>
              </div>
            </>
          ) : availableRewards.length === 0 ? (
            <p className="text-xs text-gray-400">
              Belum ada hadiah tersedia saat ini.{' '}
              <Link href="/hadiah" className="text-functional-green hover:underline font-medium">
                Lihat katalog &rarr;
              </Link>
            </p>
          ) : null}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. SECONDARY STATISTICS — clean horizontal statistical layout  */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-y border-gray-100 py-4 max-w-2xl">
        <div className="pr-4 sm:pr-6">
          <p className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-800">
            {dashData?.totalSampahDisetorKg ?? 0}
            <span className="ml-1 text-sm font-normal text-gray-400">kg</span>
          </p>
          <p className="mt-1 text-xs text-gray-400">Sampah disetor</p>
        </div>
        <div className="px-4 sm:px-6">
          <p className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-800">
            {(dashData?.totalPoinDidapat ?? 0).toLocaleString('id-ID')}
          </p>
          <p className="mt-1 text-xs text-gray-400">Poin didapat</p>
        </div>
        <div className="pl-4 sm:pl-6">
          <p className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-800">
            {(dashData?.totalPoinDitukar ?? 0).toLocaleString('id-ID')}
          </p>
          <p className="mt-1 text-xs text-gray-400">Poin ditukar</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 4. SETOR SAMPAH CTA — compact horizontal action block          */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            ADA YANG MASIH PUNYA NILAI?
          </p>
          <p className="mt-1 text-sm font-medium text-gray-700">
            Pilah. Setor. Dapatkan poin.
          </p>
        </div>
        <Link
          href="/setoran/baru"
          id="btn-setor-sampah"
          className="inline-flex items-center justify-center shrink-0 rounded-xl bg-functional-green px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-functional-green/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-md hover:shadow-functional-green/25 active:translate-y-0 active:shadow-sm"
        >
          + Setor Sampah &rarr;
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 5. RECENT TRANSACTIONS — interactive clickable rows            */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Transaksi Terakhir
          </h2>
          {(dashData?.transaksiTerakhir?.length ?? 0) > 0 && (
            <Link
              href="/setoran"
              className="text-xs font-medium text-functional-green transition hover:underline"
            >
              Lihat semua &rarr;
            </Link>
          )}
        </div>

        {!dashData?.transaksiTerakhir?.length ? (
          <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-10 text-center bg-white/50">
            <p className="text-sm font-medium text-gray-600">Belum ada cerita di sini :)</p>
            <p className="mt-1 text-xs text-gray-400">
              Setoran pertamamu bisa dimulai hari ini.
            </p>
            <Link
              href="/setoran/baru"
              className="mt-4 inline-flex items-center rounded-xl bg-functional-green px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
            >
              + Mulai Setor &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {dashData.transaksiTerakhir.map((s) => (
              <TransactionRow key={s.id} s={s} />
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 6. IMPACT NOTE — lightweight editorial note                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {(dashData?.totalSampahDisetorKg ?? 0) > 0 && (
        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400">
            Sedikit demi sedikit, berarti.
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Kamu sudah menyalurkan{' '}
            <span className="font-semibold text-gray-800">
              {dashData!.totalSampahDisetorKg} kg
            </span>{' '}
            sampah daur ulang.{' '}
            <span className="text-gray-400">
              Terima kasih sudah memberi kesempatan kedua :)
            </span>
          </p>
        </div>
      )}

    </div>
  );
}
