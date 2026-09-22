'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface PublicRevealProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'span' | 'li';
  style?: React.CSSProperties;
  delay?: number;
}

export function PublicReveal({
  children,
  className = '',
  as: Component = 'div',
  style,
  delay = 0,
}: PublicRevealProps) {
  const ref = useRef<HTMLElement | null>(null) as any;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      node.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.disconnect();
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.14,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref}
      data-reveal
      className={className}
      style={{
        ...style,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Component>
  );
}
