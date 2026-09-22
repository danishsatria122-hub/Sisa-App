'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { getErrorMessage } from '@/lib/api';
import { SisaLogo, SisaSmileIcon } from '@/components/sisa-logo';
import { SisaSmilePatternGrid } from '@/components/sisa-smile-watermark';

const schema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const getFriendlyLoginError = (err: unknown) => {
    const message = getErrorMessage(err).toLowerCase();

    if (message.includes('terdaftar') || message.includes('not found') || message.includes('user tidak ditemukan')) {
      return 'Akunmu belum terdaftar di SI:)SA, atau emailnya mungkin typo. Coba cek lagi ya :)';
    }

    return 'Waduh, kombinasi email dan password belum cocok. Cek lagi, ya — SI:)SA nggak mau bikin kamu pusing.';
  };

  const onSubmit = async (values: FormData) => {
    setSubmitting(true);
    setLoginError(null);

    try {
      const user = await login(values.email, values.password);
      showToast(`Selamat datang, ${user.name}!`, 'success');
      router.push(user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      const friendlyMessage = getFriendlyLoginError(err);
      setLoginError(friendlyMessage);
      showToast(friendlyMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-functional-green flex flex-col items-center justify-center px-4 py-12 overflow-hidden selection:bg-smile-yellow selection:text-gray-900">

      {/* ─── Seamless Background Illustration ───────────────────────── */}

      {/* Diagonal smile grid pattern — fills entire background */}
      <SisaSmilePatternGrid
        color="#FFFFFF"
        opacity={0.07}
        spacing={100}
        iconSize={20}
        rotate={-14}
      />

      {/* Abstract organic blob — top right */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-[480px] opacity-[0.13]"
        viewBox="0 0 480 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 420 80 C 500 160, 510 300, 420 380 C 330 460, 160 490, 70 400 C -20 310, 10 130, 100 60 C 190 -10 340 0 420 80 Z"
          fill="#FAEF8A"
        />
      </svg>

      {/* Abstract organic blob — bottom left */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-28 w-[420px] opacity-[0.12]"
        viewBox="0 0 420 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 80 30 C 200 -20 370 40 400 160 C 430 280 340 420 200 410 C 60 400 -30 280 20 150 C 40 90 60 50 80 30 Z"
          fill="#FFFFFF"
        />
      </svg>

      {/* Smile arc decorative — top left corner */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-6 left-8 w-[90px] opacity-20"
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 10 15 Q 50 55 90 15"
          stroke="#FAEF8A"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Smile arc decorative — bottom right */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 right-10 w-[70px] opacity-15"
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 10 15 Q 50 55 90 15"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Dot cluster — mid-left */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 w-16 opacity-20"
        viewBox="0 0 60 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="10" r="5" fill="#FAEF8A" />
        <circle cx="40" cy="30" r="3.5" fill="#FFFFFF" />
        <circle cx="18" cy="56" r="6" fill="#FFFFFF" />
        <circle cx="50" cy="75" r="3" fill="#FAEF8A" />
        <circle cx="8" cy="100" r="4.5" fill="#FFFFFF" />
        <circle cx="44" cy="112" r="2.5" fill="#FAEF8A" />
      </svg>

      {/* Dot cluster — mid-right */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 w-16 opacity-20"
        viewBox="0 0 60 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="10" r="4" fill="#FFFFFF" />
        <circle cx="20" cy="28" r="6" fill="#FAEF8A" />
        <circle cx="48" cy="55" r="3" fill="#FFFFFF" />
        <circle cx="12" cy="78" r="5" fill="#FAEF8A" />
        <circle cx="44" cy="98" r="3.5" fill="#FFFFFF" />
        <circle cx="15" cy="115" r="4" fill="#FAEF8A" />
      </svg>

      {/* ─── Top Nav Bar ─────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 sm:px-10 z-20">
        <Link href="/" className="transition hover:opacity-80" aria-label="Beranda SI:)SA">
          <SisaLogo variant="white" height={34} />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
        >
          <span aria-hidden="true">←</span>
          <span>Beranda</span>
        </Link>
      </div>

      {/* ─── Floating Form Card ──────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[420px]">

        {/* Card */}
        <div className="rounded-3xl bg-white px-8 py-10 shadow-2xl shadow-black/20 sm:px-10">

          {/* Card Header */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-functional-green/20 bg-functional-green/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-functional-green">
              <span className="h-1.5 w-1.5 rounded-full bg-functional-green" />
              Masuk Akun
            </span>
            <h1 className="mt-4 font-sans text-2xl font-semibold tracking-tight text-gray-900 leading-snug">
              Selamat datang kembali :)
            </h1>
            <p className="mt-1.5 text-sm text-gray-400 leading-relaxed">
              Masuk untuk melihat saldo poin dan riwayat setoranmu.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {loginError && (
              <div
                role="alert"
                aria-live="polite"
                className="rounded-2xl border border-amber-200 bg-gradient-to-r from-yellow-50 via-amber-50 to-emerald-50 p-3.5 shadow-sm shadow-amber-200/40"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm ring-2 ring-amber-200/70">
                    <SisaSmileIcon size={22} color="#F59E0B" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800">Ups, login belum cocok :(</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">{loginError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-400"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                {...register('email')}
                autoComplete="email"
                placeholder="nama@email.com"
                className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 transition-all outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-100'
                    : 'border-gray-200 bg-gray-50/50 focus:border-functional-green focus:ring-functional-green/15 focus:bg-white'
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <span aria-hidden="true">⚠</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-400"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  className={`w-full rounded-xl border px-4 py-3 pr-24 text-sm text-gray-900 placeholder:text-gray-300 transition-all outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-100'
                      : 'border-gray-200 bg-gray-50/50 focus:border-functional-green focus:ring-functional-green/15 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 select-none text-[11px] font-semibold text-gray-400 hover:text-gray-600 transition py-1"
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <span aria-hidden="true">⚠</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button
                id="btn-login-submit"
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-functional-green py-3.5 text-sm font-semibold text-white shadow-sm shadow-functional-green/25 transition-all hover:bg-green-600 hover:shadow-md hover:shadow-functional-green/30 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Masuk ke Akun</span>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Register */}
          <div className="mt-7 pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-semibold text-functional-green hover:underline hover:text-green-700 transition"
            >
              Daftar Sekarang →
            </Link>
          </div>
        </div>

        {/* Below Card: Brand tagline */}
        <p className="mt-6 text-center text-xs text-white/50 font-normal">
          © 2026 SI:)SA — <span className="italic">A little smile for things left behind.</span>
        </p>
      </div>
    </main>
  );
}
