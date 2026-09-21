'use client';

import { LandingNav } from '@/components/landing-nav';
import { HeroSection } from '@/components/hero-section';
import { LandingFeatures } from '@/components/landing-features';
import { LandingFooter } from '@/components/landing-footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-primary-green selection:text-gray-900">
      <LandingNav />
      <main>
        <HeroSection />
        <LandingFeatures />
      </main>
      <LandingFooter />
    </div>
  );
}
