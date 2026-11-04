import Link from 'next/link';

export default function WorkIntro() {
  return (
    <>
<section className="wk-hero">
<Link className="wk-back" href="/"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></svg><span>Back to home</span></Link>
<p className="wk-label">Work</p>
<h1 className="wk-title"><span className="h2l"><span>The work<span className="dot">.</span></span></span></h1>
<p className="wk-sub">Websites I build and the systems that run behind them. Pick a category or scroll through everything.</p>
</section>
<div className="tabs-wrap"><nav className="tabs glass" aria-label="Project categories">
<a href="#all" data-f="all">All <sup>02</sup></a>
<a href="#websites" data-f="websites">Websites <sup>01</sup></a>
<a href="#automations" data-f="automations">Automations &amp; Systems <sup>01</sup></a>
</nav></div>
    </>
  );
}
