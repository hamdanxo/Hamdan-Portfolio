import Link from 'next/link';
import { work } from '@/data/designs';

export default function DesignIntro() {
  const count = work.length;
  return (
    <section className="wk-hero">
      <Link className="wk-back" href="/">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></svg>
        <span>Back to home</span>
      </Link>
      <p className="wk-label">Graphic design · {count < 10 ? `0${count}` : count} {count === 1 ? 'project' : 'projects'}</p>
      <h1 className="wk-title"><span className="h2l"><span>The designs</span></span></h1>
      <p className="wk-sub">Brand work, social posts, print and ad creatives. Drag around to explore, or switch to the list.</p>
    </section>
  );
}
