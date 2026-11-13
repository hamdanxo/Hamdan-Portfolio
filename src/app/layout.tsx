import type { Metadata, Viewport } from 'next';
import { fontVariables } from './fonts';
import { site } from '@/lib/site';
import { heroModeScript } from '@/components/effects/HeroLayoutScript';
import ScrollRail from '@/components/layout/ScrollRail';
import PageTransitions from '@/components/effects/PageTransitions';
import ScrollLine from '@/components/effects/ScrollLine';
import '@/styles/components.css';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: '%s | Muhammad Hamdan' },
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', title: site.title, description: site.description, url: '/', siteName: site.name },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
  robots: { index: true, follow: true },
};

// First visit only: a short line fills the screen, then lifts away like a curtain. Tap to skip.
const introScript = "try{if(localStorage.getItem('mh-intro'))document.documentElement.classList.add('intro-seen');else localStorage.setItem('mh-intro','1')}catch(e){document.documentElement.classList.add('intro-seen')}document.addEventListener('pointerdown',function(e){var t=e.target;if(t&&t.closest&&t.closest('#intro'))document.documentElement.classList.add('intro-skip')});";
const introHtml = '<p class="intro-q"><span>Ideas,</span> <span>made</span> <em>visible.</em></p><i class="intro-line"></i>';

export const viewport: Viewport = {
  themeColor: '#060708',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: heroModeScript }} />
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <div id="intro" aria-hidden="true" dangerouslySetInnerHTML={{ __html: introHtml }} />
        {children}
        <PageTransitions />
        <ScrollLine />
        <ScrollRail />
      </body>
    </html>
  );
}
