'use client';

import Image from 'next/image';

interface SisaSmileWatermarkProps {
  size?: number;
  className?: string;
  rotate?: number;
  opacity?: number;
  color?: 'yellow' | 'white' | 'green' | 'soft-green' | 'dark';
}

export function SisaSmileWatermark({
  size = 200,
  className = '',
  rotate = 0,
  opacity = 0.1,
  color = 'yellow',
}: SisaSmileWatermarkProps) {
  let filterStyle = '';
  if (color === 'white') {
    filterStyle = 'brightness(0) invert(1)';
  } else if (color === 'green') {
    filterStyle = 'brightness(0.4) sepia(1) hue-rotate(85deg) saturate(3)';
  } else if (color === 'soft-green') {
    filterStyle = 'sepia(1) hue-rotate(50deg) saturate(1.8) brightness(1.1)';
  } else if (color === 'dark') {
    filterStyle = 'brightness(0.15)';
  }

  const height = Math.round(size * (388 / 404));

  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${height}px`,
        transform: `rotate(${rotate}deg)`,
        opacity,
      }}
      aria-hidden="true"
    >
      <Image
        src="/images/brand/sisa-smile-accent.png"
        alt=""
        width={404}
        height={388}
        className="w-full h-full object-contain"
        style={{ filter: filterStyle || undefined }}
        priority={false}
      />
    </div>
  );
}

interface SisaSmilePatternGridProps {
  color?: string;
  opacity?: number;
  spacing?: number;
  iconSize?: number;
  rotate?: number;
  className?: string;
}

export function SisaSmilePatternGrid({
  color = '#FFFFFF',
  opacity = 0.04,
  spacing = 110,
  iconSize = 22,
  rotate = -12,
  className = '',
}: SisaSmilePatternGridProps) {
  const patternId = `sisa-grid-${spacing}-${iconSize}-${Math.abs(rotate)}`;
  const halfSpacing = spacing / 2;
  const iconScale = iconSize / 100;

  return (
    <div
      className={`pointer-events-none absolute inset-0 select-none overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(${rotate})`}
          >
            {/* Smile 1 */}
            <g transform={`translate(${halfSpacing / 2 - iconSize / 2}, ${halfSpacing / 2 - iconSize / 2}) scale(${iconScale})`}>
              <ellipse cx="26" cy="26" rx="13" ry="20" fill={color} />
              <ellipse cx="74" cy="26" rx="13" ry="20" fill={color} />
              <path
                d="M 22 62 C 38 78, 62 78, 78 62"
                stroke={color}
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Staggered Smile 2 for diagonal offset brick flow */}
            <g transform={`translate(${spacing - halfSpacing / 2 - iconSize / 2}, ${spacing - halfSpacing / 2 - iconSize / 2}) scale(${iconScale})`}>
              <ellipse cx="26" cy="26" rx="13" ry="20" fill={color} />
              <ellipse cx="74" cy="26" rx="13" ry="20" fill={color} />
              <path
                d="M 22 62 C 38 78, 62 78, 78 62"
                stroke={color}
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
