import Link from 'next/link';

export default function WorkIntro() {
  return (
    <>
<section className="wk-hero">
<Link className="wk-back" href="/"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></svg><span>Back to home</span></Link>
<p className="wk-label">Work</p>
<h1 className="wk-title"><span className="h2l"><span>The work</span></span></h1>
<p className="wk-sub">Tools and systems I build for the companies I work with.</p>
</section>
    </>
  );
}
