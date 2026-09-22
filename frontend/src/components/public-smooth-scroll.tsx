'use client';

import { useEffect } from 'react';

export function PublicSmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('public-scroll-smooth');

    if (prefersReducedMotion) {
      document.documentElement.classList.remove('public-scroll-smooth');
      return;
    }

    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const target = document.querySelector(hash);
      if (!target) return;

      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);

    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
      document.documentElement.classList.remove('public-scroll-smooth');
    };
  }, []);

  return null;
}
