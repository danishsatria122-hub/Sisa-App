'use client';

import { useEffect, useRef, useState } from 'react';

export function QrScanner({ onResult }: { onResult: (code: string) => void }) {
  const containerId = useRef(`qr-reader-${Math.random().toString(36).slice(2)}`);
  const scannerRef = useRef<any>(null);
  const [cameraError, setCameraError] = useState(false);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    let mounted = true;

    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if (!mounted) return;
      const scanner = new Html5Qrcode(containerId.current);
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 220 },
          (decodedText: string) => {
            onResult(decodedText);
          },
          () => {
            // ignore per-frame "not found" noise
          },
        )
        .catch(() => {
          setCameraError(true);
        });
    });

    return () => {
      mounted = false;
      scannerRef.current
        ?.stop()
        .then(() => scannerRef.current?.clear())
        .catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      {!cameraError && (
        <div id={containerId.current} className="mx-auto w-full max-w-xs overflow-hidden rounded-xl" />
      )}
      {cameraError && (
        <p className="text-center text-sm text-amber-600">
          Kamera tidak tersedia atau akses ditolak. Masukkan kode QR secara manual di bawah.
        </p>
      )}

      <div className="flex gap-2">
        <input
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Atau masukkan kode QR manual"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          onClick={() => manualCode.trim() && onResult(manualCode.trim())}
          className="rounded-lg bg-functional-green px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
        >
          Cari
        </button>
      </div>
    </div>
  );
}
