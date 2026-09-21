import type { Metadata } from 'next';
import { LandingNav } from '@/components/landing-nav';
import { LandingFooter } from '@/components/landing-footer';
import { AboutOpening } from '@/components/about/about-opening';
import { AboutMissionData } from '@/components/about/about-mission-data';
import { AboutToday } from '@/components/about/about-today';
import { AboutIdentity } from '@/components/about/about-identity';
import { AboutNext } from '@/components/about/about-next';
import { AboutCta } from '@/components/about/about-cta';

export const metadata: Metadata = {
  title: 'Tentang Kami — SI:)SA',
  description:
    'Yang tersisa bukan berarti tidak bernilai. Kenali filosofi, cara pandang, dan cerita di balik SI:)SA — bank sampah digital yang percaya setiap material daur ulang masih punya cerita.',
};

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen bg-[#FAFBF9] text-gray-900 selection:bg-primary-green selection:text-gray-900 flex flex-col">
      <LandingNav />
      <main className="flex-1">
        {/* 01 — OPENING (No photo, no CTA) */}
        <AboutOpening />

        {/* 02 — MISI + DATA (Merged stats with count up + mission block) */}
        <AboutMissionData />

        {/* 03 — HARI INI (Short 5-node flow + Cara Kerja link) */}
        <AboutToday />

        {/* 04 — FILOSOFI LOGO (LOCKED, byte-for-byte untouched) */}
        <AboutIdentity />

        {/* 05 — BERIKUTNYA (3 open columns 01-03) */}
        <AboutNext />

        {/* 06 — CTA (Reused green card + pill buttons) */}
        <AboutCta />
      </main>
      <LandingFooter />
    </div>
  );
}

