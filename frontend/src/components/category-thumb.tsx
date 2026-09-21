'use client';

import { useState } from 'react';

interface CategoryThumbProps {
  /** The remote URL from foto_url, or null/undefined for placeholder */
  src?: string | null;
  /** Category name used as alt text */
  name: string;
  /** Square dimension in px — drives both width and height */
  size: number;
  /** Extra className forwarded to the wrapper element */
  className?: string;
}

/** Neutral placeholder rendered when src is absent or the image fails to load */
function Placeholder({ size }: { size: number }) {
  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size, minWidth: size }}
      className="flex items-center justify-center rounded-xl border border-gray-100 bg-gray-100"
    >
      <svg
        className="text-gray-400"
        style={{ width: size * 0.45, height: size * 0.45, opacity: 0.5 }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}

/**
 * CategoryThumb — displays a waste-category photo with a graceful fallback.
 *
 * Usage:
 *   <CategoryThumb src={kategori.foto_url} name={kategori.nama} size={48} />
 *
 * Sizes used in the app:
 *   list rows   -> size={48}
 *   picker      -> size={40}
 *   detail view -> size={96}
 */
export function CategoryThumb({ src, name, size, className = '' }: CategoryThumbProps) {
  const [broken, setBroken] = useState(false);

  // Show placeholder when no URL is provided or the image load failed
  if (!src || broken) {
    return (
      <span className={className} style={{ display: 'inline-flex', flexShrink: 0 }}>
        <Placeholder size={size} />
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', flexShrink: 0, width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setBroken(true)}
        style={{
          width: size,
          height: size,
          objectFit: 'cover',
          borderRadius: 12,
          border: '1px solid #f3f4f6',
          display: 'block',
          flexShrink: 0,
        }}
      />
    </span>
  );
}
