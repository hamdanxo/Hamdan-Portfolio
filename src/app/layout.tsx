import type { Metadata, Viewport } from 'next';
import { fontVariables } from './fonts';
import { site } from '@/lib/site';
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

export const viewport: Viewport = {
  themeColor: '#060708',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
