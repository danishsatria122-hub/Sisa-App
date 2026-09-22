'use client';

import { useEffect, useRef, useState } from 'react';

export function QrScanner({
  onResult,
  disabled = false,
}: {
  onResult: (code: string) => Promise<void> | void;
  disabled?: boolean;
}) {
  const containerId = useRef(`qr-reader-${Math.random().toString(36).slice(2)}`);
  const scannerRef = useRef<any>(null);
  const processingRef = useRef(false);
  const [cameraError, setCameraError] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;

    try {
      if (typeof scanner.pause === 'function') {
        scanner.pause();
      }
    } catch {
      // ignore pause failures
    }

    try {
      if (typeof scanner.stop === 'function') {
        await scanner.stop();
      }
    } catch {
      // ignore stop failures
    }
  };

  useEffect(() => {
    if (disabled) {
      void stopScanner();
      processingRef.current = false;
      return;
    }

    let mounted = true;

    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if (!mounted) return;

      const scanner = new Html5Qrcode(containerId.current);
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 220 },
          async (decodedText: string) => {
            if (processingRef.current || disabled) return;
            processingRef.current = true;
            try {
              await stopScanner();
              await onResult(decodedText);
            } catch {
              // parent decides whether to show error state / retry
            }
          },
          () => {
            // ignore per-frame not-found noise
          },
        )
        .catch(() => {
          setCameraError(true);
        });
    });

    return () => {
      mounted = false;
      processingRef.current = false;
      void stopScanner();
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch(() => {});
      }
      scannerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, onResult]);

  return (
    <div className="space-y-3 sm:space-y-4">
      {!cameraError && (
        <div className="flex justify-center px-1 sm:px-2">
          <div className="relative mx-auto h-56 w-full max-w-[280px] overflow-hidden rounded-2xl border border-gray-200 bg-black/5 shadow-sm sm:h-64">
            <div
              id={containerId.current}
              className="absolute inset-0 overflow-hidden rounded-2xl bg-gray-100"
            />

            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-3 top-3 h-8 w-8 border-l-2 border-t-2 border-white/90" />
              <div className="absolute right-3 top-3 h-8 w-8 border-r-2 border-t-2 border-white/90" />
              <div className="absolute bottom-3 left-3 h-8 w-8 border-b-2 border-l-2 border-white/90" />
              <div className="absolute bottom-3 right-3 h-8 w-8 border-b-2 border-r-2 border-white/90" />
            </div>
          </div>
        </div>
      )}

      {!cameraError && (
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.12em] text-gray-500">
          Arahkan kamera ke QR setoran
        </p>
      )}

      {cameraError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-700">
          Kamera tidak tersedia atau akses ditolak. Masukkan kode QR secara manual di bawah.
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Atau masukkan kode QR manual"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-functional-green focus:outline-none focus:ring-2 focus:ring-functional-green/20"
        />
        <button
          type="button"
          onClick={async () => {
            const code = manualCode.trim();
            if (!code) return;
            if (processingRef.current || disabled) return;
            processingRef.current = true;
            try {
              await stopScanner();
              await onResult(code);
            } catch {
              // parent decides whether to show error state / retry
            }
          }}
          className="rounded-lg bg-functional-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-functional-green/20"
        >
          Cari
        </button>
      </div>
    </div>
  );
}
