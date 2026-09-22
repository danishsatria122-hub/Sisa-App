'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

const NAVBAR_HEIGHT = 76;

export function PublicSmoothScroll() {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const existing = (window as Window & { __sisaLenis?: Lenis }).__sisaLenis;
    if (existing) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      syncTouch: false,
      lerp: 0.08,
      gestureOrientation: 'vertical',
      orientation: 'vertical',
      infinite: false,
      autoRaf: false,
    });

    (window as Window & { __sisaLenis?: Lenis }).__sisaLenis = lenis;
    document.documentElement.classList.add('lenis');

    const tick = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(tick);
    };

    if (!prefersReducedMotion) {
      rafRef.current = requestAnimationFrame(tick);
    }

    const scrollToTarget = (target: Element | null) => {
      if (!target) return;
      lenis.scrollTo(target as HTMLElement, { offset: -NAVBAR_HEIGHT, duration: 1.1 });
    };

    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const target = document.querySelector(hash);
      scrollToTarget(target);
    };

    const handleAnchorClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href') ?? '';
      if (!href.startsWith('#') && !(href.startsWith('/#'))) return;
      const hash = href.includes('#') ? href.split('#')[1] : '';
      if (!hash) return;
      const element = document.getElementById(hash);
      if (!element) return;
      event.preventDefault();
      scrollToTarget(element);
      if (href.startsWith('/')) {
        history.pushState(null, '', `/#${hash}`);
      }
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
      document.removeEventListener('click', handleAnchorClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      document.documentElement.classList.remove('lenis');
      document.documentElement.classList.remove('lenis-stopped');
      delete (window as Window & { __sisaLenis?: Lenis }).__sisaLenis;
    };
  }, []);

  return null;
}
