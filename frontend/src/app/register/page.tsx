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
import { SisaLogo } from '@/components/sisa-logo';
import { SisaSmilePatternGrid } from '@/components/sisa-smile-watermark';

const schema = z
  .object({
    name: z.string().min(1, 'Nama lengkap wajib diisi'),
    email: z.string().email('Format email tidak valid'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { refreshUser } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormData) => {
    setSubmitting(true);
    try {
      const { api, setToken } = await import('@/lib/api');
      const { confirmPassword, ...payload } = values;
      const { data } = await api.post('/auth/register', payload);
      setToken(data.accessToken);
      await refreshUser();
      showToast('Registrasi berhasil! Selamat datang di SI:)SA.', 'success');
      router.push('/dashboard');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-functional-green flex flex-col items-center justify-center px-4 py-16 overflow-hidden selection:bg-smile-yellow selection:text-gray-900">

      {/* ─── Seamless Background Illustration ───────────────────────── */}

      {/* Diagonal smile grid pattern */}
      <SisaSmilePatternGrid
        color="#FFFFFF"
        opacity={0.07}
        spacing={100}
        iconSize={20}
        rotate={-14}
      />

      {/* Organic blob — top left (larger, to balance longer form card) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -left-20 w-[500px] opacity-[0.12]"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 100 60 C 240 -20, 430 60, 460 200 C 490 340, 370 460, 220 450 C 70 440, -30 310, 20 170 C 50 100 70 80 100 60 Z"
          fill="#FAEF8A"
        />
      </svg>

      {/* Organic blob — bottom right */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-20 w-[440px] opacity-[0.11]"
        viewBox="0 0 440 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 360 80 C 460 170, 460 320, 360 400 C 260 480, 90 470, 30 360 C -30 250, 20 90, 130 40 C 220 -2 300 20 360 80 Z"
          fill="#FFFFFF"
        />
      </svg>

      {/* Smile arc — top right */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-10 right-10 w-[80px] opacity-20"
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M 10 15 Q 50 55 90 15" stroke="#FAEF8A" strokeWidth="9" strokeLinecap="round" fill="none" />
      </svg>

      {/* Smile arc — bottom left */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-10 w-[65px] opacity-15"
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M 10 15 Q 50 55 90 15" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" fill="none" />
      </svg>

      {/* Dot cluster — left mid */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/3 w-14 opacity-[0.18]"
        viewBox="0 0 50 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="8" r="5" fill="#FAEF8A" />
        <circle cx="38" cy="28" r="3.5" fill="#FFFFFF" />
        <circle cx="14" cy="55" r="6" fill="#FFFFFF" />
        <circle cx="42" cy="78" r="3" fill="#FAEF8A" />
        <circle cx="8" cy="102" r="4.5" fill="#FFFFFF" />
        <circle cx="36" cy="122" r="2.5" fill="#FAEF8A" />
      </svg>

      {/* Dot cluster — right mid */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-1/2 -translate-y-2/3 w-14 opacity-[0.18]"
        viewBox="0 0 50 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="40" cy="8" r="4" fill="#FFFFFF" />
        <circle cx="14" cy="28" r="6" fill="#FAEF8A" />
        <circle cx="42" cy="55" r="3" fill="#FFFFFF" />
        <circle cx="10" cy="78" r="5" fill="#FAEF8A" />
        <circle cx="40" cy="100" r="3.5" fill="#FFFFFF" />
        <circle cx="14" cy="120" r="4" fill="#FAEF8A" />
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
      <div className="relative z-10 w-full max-w-[440px]">

        {/* Card */}
        <div className="auth-panel-entry rounded-3xl bg-white px-8 py-10 shadow-2xl shadow-black/20 sm:px-10">

          {/* Card Header */}
          <div className="auth-form-item mb-7" style={{ animationDelay: '140ms' }}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-functional-green/20 bg-functional-green/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-functional-green">
              <span className="h-1.5 w-1.5 rounded-full bg-functional-green" />
              Daftar Akun
            </span>
            <h1 className="mt-4 font-sans text-2xl font-semibold tracking-tight text-gray-900 leading-snug">
              Bergabung dengan SI:)SA
            </h1>
            <p className="mt-1.5 text-sm text-gray-400 leading-relaxed">
              Mulai perjalananmu memberi nilai pada yang tersisa.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="auth-form-item space-y-4" style={{ animationDelay: '220ms' }}>

            {/* Nama Lengkap */}
            <div>
              <label
                htmlFor="reg-name"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-400"
              >
                Nama Lengkap
              </label>
              <input
                id="reg-name"
                type="text"
                {...formRegister('name')}
                autoComplete="name"
                placeholder="Budi Santoso"
                className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 transition-all outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-100'
                    : 'border-gray-200 bg-gray-50/50 focus:border-functional-green focus:ring-functional-green/15 focus:bg-white'
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <span aria-hidden="true">⚠</span>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="reg-email"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-400"
              >
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                {...formRegister('email')}
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

            {/* No. HP */}
            <div>
              <label
                htmlFor="reg-phone"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-400"
              >
                No. HP{' '}
                <span className="normal-case font-normal text-gray-300">(opsional)</span>
              </label>
              <input
                id="reg-phone"
                type="tel"
                {...formRegister('phone')}
                autoComplete="tel"
                placeholder="08123456789"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 transition-all outline-none focus:border-functional-green focus:ring-2 focus:ring-functional-green/15 focus:bg-white"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-400"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  {...formRegister('password')}
                  autoComplete="new-password"
                  placeholder="Minimal 6 karakter"
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

            {/* Konfirmasi Password */}
            <div>
              <label
                htmlFor="reg-confirm-password"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-gray-400"
              >
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...formRegister('confirmPassword')}
                  autoComplete="new-password"
                  placeholder="Ulangi password Anda"
                  className={`w-full rounded-xl border px-4 py-3 pr-24 text-sm text-gray-900 placeholder:text-gray-300 transition-all outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-100'
                      : 'border-gray-200 bg-gray-50/50 focus:border-functional-green focus:ring-functional-green/15 focus:bg-white'
                  }`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 select-none text-[11px] font-semibold text-gray-400 hover:text-gray-600 transition py-1"
                >
                  {showConfirmPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                  <span aria-hidden="true">⚠</span>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                id="btn-register-submit"
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-functional-green py-3.5 text-sm font-semibold text-white shadow-sm shadow-functional-green/25 transition-all hover:bg-green-600 hover:shadow-md hover:shadow-functional-green/30 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Mendaftarkan...</span>
                  </>
                ) : (
                  <span>Mulai Perjalanan :)</span>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="auth-form-item mt-6 pt-5 border-t border-gray-100 text-center text-sm text-gray-400" style={{ animationDelay: '260ms' }}>
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="font-semibold text-functional-green hover:underline hover:text-green-700 transition"
            >
              Masuk →
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
