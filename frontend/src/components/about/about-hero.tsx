'use client';

import Image from 'next/image';

export function AboutHero() {
  const handleScrollToPerspective = () => {
    const el = document.getElementById('cara-pandang');
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        minHeight: 'clamp(560px, 86svh, 780px)',
      }}
      aria-label="About SI:)SA hero"
    >
      {/* ── 1. FULL-BLEED PHOTOGRAPH & BACKDROP ── */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden" aria-hidden="true">
        {/* Real image with subtle blur (-12px inset to prevent blurred border bleed), saturation and brightness */}
        <div
          className="absolute -inset-[12px] overflow-hidden about-photo-settle"
          style={{
            filter: 'blur(1.5px) saturate(1.1) brightness(1.05)',
            WebkitFilter: 'blur(1.5px) saturate(1.1) brightness(1.05)',
          }}
        >
          <Image
            src="/images/about/recycling-facility.jpg"
            alt="Tumpukan botol, kaleng, kardus, dan kertas yang sudah dipilah di bank sampah"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-[center_60%]"
          />
        </div>

        {/* Vertical gradient overlay: ~30% top, ~48% middle, ~62% bottom using dark green token */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(11, 32, 16, 0.30) 0%, rgba(11, 32, 16, 0.48) 50%, rgba(11, 32, 16, 0.62) 100%)',
          }}
        />

        {/* Soft radial darkening behind the center text block (~35% at center fading to 0%) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(8, 22, 11, 0.35) 0%, rgba(8, 22, 11, 0) 100%)',
          }}
        />

        {/* Subtle static film grain (3% opacity) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Bottom edge fade: seamless ~96px gradient into next section background (#FAFBF9) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(250, 251, 249, 0) 0%, #FAFBF9 100%)',
          }}
        />
      </div>

      {/* ── 2. EDITORIAL CONTENT CONTAINER ── */}
      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-5 sm:px-6 text-center flex flex-col items-center justify-center py-16 sm:py-20">
        
        {/* Eyebrow */}
        <div className="about-anim-eyebrow inline-flex items-center gap-2 mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-smile-yellow shrink-0" aria-hidden="true" />
          <span className="t-eyebrow text-white/90 select-none">
            ABOUT SI:)SA
          </span>
        </div>

        {/* Headline: single h1, two lines, same size & weight, soft shadow */}
        <h1
          className="font-display font-bold leading-[1.04] tracking-[-0.03em] [text-wrap:balance] w-full text-center"
          style={{
            fontSize: 'clamp(2.25rem, 6vw, 5rem)',
            textShadow: '0 2px 24px rgba(0, 0, 0, 0.25)',
          }}
        >
          <span className="about-anim-line1 block text-white">
            Yang tersisa bukan berarti
          </span>
          <span className="about-anim-line2 block text-primary-green">
            tidak bernilai
            <span className="text-smile-yellow select-none">.</span>
          </span>
        </h1>

        {/* Supporting copy */}
        <p
          className="about-anim-copy font-sans font-light text-white/92 leading-[1.65] max-w-[30em] mx-auto [text-wrap:balance] mt-5"
          style={{
            fontSize: 'clamp(1.0625rem, 1.5vw, 1.375rem)',
            textShadow: '0 2px 24px rgba(0, 0, 0, 0.25)',
          }}
        >
          Kami percaya, setiap yang tersisa masih punya cerita.
        </p>

        {/* Button: Kenali Cara Pandang Kami */}
        <div className="about-anim-btn mt-9 flex items-center justify-center w-full">
          <button
            type="button"
            onClick={handleScrollToPerspective}
            className="group inline-flex h-[52px] w-full max-w-[320px] sm:w-auto items-center justify-center gap-2.5 rounded-full bg-white px-7 font-sans text-base font-semibold text-green-dark shadow-sm transition-all duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(30,58,32,0.30)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px] motion-reduce:transform-none motion-reduce:transition-colors shrink-0 cursor-pointer select-none"
          >
            <span>Kenali Cara Pandang Kami</span>
            <span
              className="inline-block text-functional-green transition-transform duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-hover:translate-y-[3px] motion-reduce:transform-none"
              aria-hidden="true"
            >
              ↓
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}

