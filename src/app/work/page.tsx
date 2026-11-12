import type { Metadata } from 'next';
import SmoothScroll from '@/components/effects/SmoothScroll';
import Reveal from '@/components/effects/Reveal';
import Cursor from '@/components/effects/Cursor';
import SiteHeader from '@/components/layout/SiteHeader';
import WorkIntro from '@/components/work/WorkIntro';
import Automations from '@/components/work/Automations';
import Websites from '@/components/work/Websites';
import WorkCta from '@/components/work/WorkCta';
import ContactSpotlight from '@/components/effects/ContactSpotlight';
import '@/styles/work.css';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Client work by Muhammad Hamdan: the lead system built for Lapiz Blue and the Casted Luxe website.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  return (
    <div className="page">
      <div className="page-inner">
        <SiteHeader page="work" />
        <main id="work">
          <WorkIntro />
          <Automations />
          <Websites />
          <WorkCta />
        </main>
      </div>
      <SmoothScroll />
      <Reveal selector=".wk-hero, .cat-head, .cs, .empty, .wk-cta-box" className="rv2" />
      <ContactSpotlight />
      <Cursor magnetic=".wk-hero a, header nav a:last-child, .cs-links a" />
    </div>
  );
}
