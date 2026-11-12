import type { Metadata } from 'next';
import SmoothScroll from '@/components/effects/SmoothScroll';
import Reveal from '@/components/effects/Reveal';
import Cursor from '@/components/effects/Cursor';
import SiteHeader from '@/components/layout/SiteHeader';
import DesignIntro from '@/components/design/DesignIntro';
import DesignGallery from '@/components/work/DesignGallery';
import WorkCta from '@/components/work/WorkCta';
import ContactSpotlight from '@/components/effects/ContactSpotlight';
import '@/styles/work.css';

export const metadata: Metadata = {
  title: 'Graphic Design',
  description: 'Graphic design by Muhammad Hamdan: brand work, social posts, print and ad creatives.',
  alternates: { canonical: '/design' },
};

export default function DesignPage() {
  return (
    <div className="page">
      <div className="page-inner">
        <SiteHeader page="design" />
        <main id="work" className="design-page">
          <DesignIntro />
          <section className="design-gallery" aria-label="Design gallery">
            <DesignGallery fullscreen />
          </section>
          <WorkCta />
        </main>
      </div>
      <SmoothScroll />
      <Reveal selector=".wk-cta-box" className="rv2" />
      <ContactSpotlight />
      <Cursor magnetic=".wk-hero a, header nav a:last-child" />
    </div>
  );
}
