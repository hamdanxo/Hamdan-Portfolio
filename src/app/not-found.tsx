import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/layout/SiteHeader';
import DustNumber from '@/components/notfound/DustNumber';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="page">
      <div className="page-inner">
        <SiteHeader page="other" />
        <main className="nf">
          <h1 className="sr-only">404, page not found</h1>
          <DustNumber />
          <p className="nf-eye"><i aria-hidden="true" />Page not found</p>
          <p className="nf-line">This page turned to dust.</p>
          <div className="nf-btns">
            <Link className="nf-home" href="/">Back home</Link>
            <Link className="nf-alt" href="/design">See the designs</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
