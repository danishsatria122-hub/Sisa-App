'use client';

import { ReactNode } from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/50 px-6 py-14 text-center">
      <div className="mb-3 text-4xl">📭</div>
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function PageSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-green border-t-transparent" />
    </div>
  );
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-functional-green hover:bg-green-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
  contentClassName = '',
  headerClassName = '',
  closeButtonClassName = '',
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  contentClassName?: string;
  headerClassName?: string;
  closeButtonClassName?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={`max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl ${contentClassName}`}
      >
        <div className={`mb-4 flex items-center justify-between gap-3 ${headerClassName}`}>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className={`flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-base text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-functional-green/20 ${closeButtonClassName}`}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
