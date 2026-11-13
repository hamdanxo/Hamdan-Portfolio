import Image from 'next/image';
import castedShot from '@/assets/castedluxe-home.webp';

const arrow = (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
);

export default function Websites() {
  return (
    <>
<section className="cat" id="websites" data-cat="websites">
<div className="cat-head"><div><h2 className="cat-name">Websites</h2><p className="cat-desc">Sites I design and build, from first sketch to live link.</p></div><span className="cat-count">01 project</span></div>
<div className="cat-list"><article className="cs glass">
<div className="cs-top">
<span className="cs-num">01</span>
<div className="cs-name"><span className="cs-kicker">Casted Luxe · 2026</span><h3 className="cs-title">Casted Luxe website</h3></div>
<div className="cs-tags"><span className="chip">Web design</span><span className="chip">Front end</span></div>
</div>
<div className="cs-body">
<div className="cs-visual"><div className="browser">
<div className="browser-bar"><i></i><i></i><i></i><span>castedluxe.com</span></div>
<Image quality={92} src={castedShot} alt="Casted Luxe home page: Eternally Yours over a white relief artwork of birds and flowers" sizes="(max-width: 900px) 92vw, 58vw" />
</div></div>
<div className="cs-text">
<div className="cs-block"><h4>Overview</h4><p>The website for Casted Luxe by Ashrat, a Dubai atelier making custom resin art, Arabic calligraphy and luxury wall art. Built to feel like the pieces themselves: calm, handmade and high end.</p></div>
<div className="cs-block"><h4>What&apos;s inside</h4><ol className="cs-steps"><li><span>01</span><p>A home page that opens on a relief artwork, with the Eternally Yours title rising in as you scroll</p></li><li><span>02</span><p>Gallery, The Process and About pages</p></li><li><span>03</span><p>A Craft Your Vision button on every page to start an order</p></li></ol></div>
<div className="cs-block"><h4>Built with</h4><div className="cs-chips"><span className="chip">Next.js</span><span className="chip">Tailwind CSS</span></div></div>
<div className="cs-foot"><span className="cs-status"><i></i>Live</span><div className="cs-links"><a href="https://castedluxe.com" target="_blank" rel="noopener noreferrer">Visit site {arrow}</a></div></div>
</div>
</div>
</article></div>
</section>
    </>
  );
}
