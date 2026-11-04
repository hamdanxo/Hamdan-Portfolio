import type { Metadata } from 'next';
import LiquidBackground from '@/components/effects/LiquidBackground';
import SmoothScroll from '@/components/effects/SmoothScroll';
import Reveal from '@/components/effects/Reveal';
import Cursor from '@/components/effects/Cursor';
import GlowParallax from '@/components/effects/GlowParallax';
import WorkTabs from '@/components/effects/WorkTabs';
import Glows from '@/components/layout/Glows';
import SiteHeader from '@/components/layout/SiteHeader';
import WorkIntro from '@/components/work/WorkIntro';
import Websites from '@/components/work/Websites';
import Automations from '@/components/work/Automations';
import WorkCta from '@/components/work/WorkCta';
import '@/styles/work.css';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Websites and automation systems built by Muhammad Hamdan.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  return (
    <div className="page">
      <LiquidBackground />
      <Glows />
      <div className="page-inner">
        <SiteHeader page="work" />
        <main id="work">
          <WorkIntro />
          <Websites />
          <Automations />
          <WorkCta />
        </main>
      </div>
      <SmoothScroll />
      <WorkTabs />
      <Reveal selector=".wk-hero, .cat-head, .cs, .empty, .wk-cta-box" className="rv2" />
      <Cursor magnetic=".wk-hero a, header nav a:last-child, .cs-links a" />
      <GlowParallax />
    </div>
  );
}
