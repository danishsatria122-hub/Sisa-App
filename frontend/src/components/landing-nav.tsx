'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SisaLogo, SisaSmileIcon } from './sisa-logo';
import './landing-nav.css';

const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang Kami', href: '/tentang-kami' },
  { label: 'Cara Kerja', href: '/#cara-kerja' },
  { label: 'Hadiah', href: '/#keuntungan' },
];

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function LandingNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sliding highlight pill state
  const navRef = useRef<HTMLElement>(null);
  const [hl, setHl] = useState<{ x: number; w: number; visible: boolean }>({
    x: 0,
    w: 0,
    visible: false,
  });

  const isActive = (href: string) =>
    href === pathname || (href === '/' && pathname === '/');

  const moveTo = (el: HTMLElement) => {
    setHl({
      x: el.offsetLeft,
      w: el.offsetWidth,
      visible: true,
    });
  };

  const hideHighlight = () => {
    setHl((prev) => ({ ...prev, visible: false }));
  };

  const handleNavBlur = (e: React.FocusEvent<HTMLElement>) => {
    if (!navRef.current?.contains(e.relatedTarget as Node)) {
      hideHighlight();
    }
  };

  // Initialize highlight position from active link on mount/route change
  useIsomorphicLayoutEffect(() => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector<HTMLElement>('[aria-current="page"]');
    if (activeEl) {
      setHl({
        x: activeEl.offsetLeft,
        w: activeEl.offsetWidth,
        visible: false,
      });
    }
  }, [pathname]);

  // Passive scroll listener (scrolled = window.scrollY > 8)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close mobile menu when viewport grows past 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dashboardHref = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

  return (
    <header className="siisa-nav" data-scrolled={scrolled}>
      <div className="siisa-nav__inner">
        {/* Brand Logo */}
        <Link
          href="/"
          className="siisa-nav__logo"
          aria-label="SI:)SA, ke beranda"
        >
          <SisaLogo variant="two-tone" height={34} />
        </Link>

        {/* Desktop Centered Navigation Links with Sliding Pill */}
        <nav
          className="siisa-nav__links"
          ref={navRef}
          aria-label="Navigasi utama"
          onMouseLeave={hideHighlight}
          onBlur={handleNavBlur}
        >
          <span
            className="siisa-nav__highlight"
            aria-hidden="true"
            style={{
              width: hl.w,
              transform: `translateX(${hl.x}px)`,
              opacity: hl.visible ? 1 : 0,
            }}
          />
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="siisa-nav__link"
              aria-current={isActive(link.href) ? 'page' : undefined}
              onMouseEnter={(e) => moveTo(e.currentTarget)}
              onFocus={(e) => moveTo(e.currentTarget)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section: Actions & Hamburger */}
        <div className="siisa-nav__right">
          {user ? (
            <Link href={dashboardHref} className="siisa-nav__cta">
              <span>Dashboard Saya</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <>
              <Link href="/login" className="siisa-nav__subtle-link">
                Masuk
              </Link>
              <Link href="/register" className="siisa-nav__cta">
                <span>Mulai Setor</span>
                <SisaSmileIcon
                  size={17}
                  color="var(--smile-yellow, #FAEF8A)"
                  className="siisa-nav__cta-smile"
                />
              </Link>
            </>
          )}

          <button
            className="siisa-nav__burger"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="siisa-mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Panel */}
      <div id="siisa-mobile-menu" className="siisa-nav__panel" data-open={open}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="siisa-nav__link"
            aria-current={isActive(link.href) ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        <div className="siisa-nav__panel-cta">
          {user ? (
            <Link
              href={dashboardHref}
              className="siisa-nav__cta"
              onClick={() => setOpen(false)}
            >
              <span>Dashboard Saya</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="siisa-nav__panel-subtle"
                onClick={() => setOpen(false)}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="siisa-nav__cta"
                onClick={() => setOpen(false)}
              >
                <span>Mulai Setor</span>
                <SisaSmileIcon size={17} color="var(--smile-yellow, #FAEF8A)" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
