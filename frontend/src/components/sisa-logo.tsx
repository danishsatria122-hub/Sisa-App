'use client';

interface SisaLogoProps {
  variant?: 'two-tone' | 'green' | 'yellow' | 'white' | 'dark';
  className?: string;
  height?: number | string;
}

export function SisaLogo({ variant = 'two-tone', className = '', height = 38 }: SisaLogoProps) {
  // Color mappings based on exact brand asset images using CSS variables
  const textColor =
    variant === 'yellow'
      ? 'var(--smile-yellow, #FAEF8A)'
      : variant === 'white'
      ? '#FFFFFF'
      : variant === 'dark'
      ? '#1E3A20'
      : 'var(--functional-green, #4CAF50)'; // Green

  const smileColor =
    variant === 'green'
      ? 'var(--functional-green, #4CAF50)'
      : variant === 'white'
      ? '#FFFFFF'
      : variant === 'dark'
      ? '#1E3A20'
      : 'var(--smile-yellow, #FAEF8A)'; // Yellow

  // Numeric height for proportional calculations
  const numHeight = typeof height === 'number' ? height : parseInt(height as string, 10) || 38;
  const fontSize = Math.round(numHeight * 0.95);
  const smileHeight = Math.round(numHeight * 0.72);

  return (
    <div
      className={`inline-flex items-center select-none font-logo tracking-tight ${className}`}
      style={{ height: `${numHeight}px`, lineHeight: 1 }}
      aria-label="SI:)SA"
    >
      {/* "SI" Text in Bagel Fat One / Fredoka */}
      <span
        className="font-logo leading-none"
        style={{ fontSize: `${fontSize}px`, color: textColor }}
      >
        SI
      </span>

      {/* Central Brand Smile Face :) */}
      <div className="flex items-center justify-center px-1" style={{ height: '100%' }}>
        <svg
          viewBox="0 0 100 90"
          style={{ height: `${smileHeight}px`, width: 'auto' }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Eye */}
          <ellipse cx="26" cy="26" rx="13" ry="21" fill={smileColor} />
          {/* Right Eye */}
          <ellipse cx="74" cy="26" rx="13" ry="21" fill={smileColor} />
          {/* Friendly Smile Curve */}
          <path
            d="M 12 52 Q 50 94 88 52 C 94 44 104 52 97 62 Q 50 108 3 62 C -4 52 6 44 12 52 Z"
            fill={smileColor}
          />
        </svg>
      </div>

      {/* "SA" Text in Bagel Fat One / Fredoka */}
      <span
        className="font-logo leading-none"
        style={{ fontSize: `${fontSize}px`, color: textColor }}
      >
        SA
      </span>
    </div>
  );
}

// Standalone Brand Smile Face Icon (:)
export function SisaSmileIcon({
  color = 'var(--smile-yellow, #FAEF8A)',
  size = 28,
  className = '',
}: {
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: `${size}px`, height: `${size * 0.9}px` }}
      className={`inline-block select-none shrink-0 ${className}`}
      aria-hidden="true"
    >
      <ellipse cx="26" cy="26" rx="13" ry="21" fill={color} />
      <ellipse cx="74" cy="26" rx="13" ry="21" fill={color} />
      <path
        d="M 12 52 Q 50 94 88 52 C 94 44 104 52 97 62 Q 50 108 3 62 C -4 52 6 44 12 52 Z"
        fill={color}
      />
    </svg>
  );
}
