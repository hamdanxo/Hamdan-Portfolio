import Link from 'next/link';
import Image from 'next/image';
import siteShot from '@/assets/site-shot.webp';
import BrandBoard from './BrandBoard';

export default function Websites() {
  return (
    <>
<section className="cat" id="cat-websites" data-cat="websites">
<div className="cat-head"><span className="cat-num">02</span><div><h2 className="cat-name">Websites</h2><p className="cat-desc">Sites I design and build, from first sketch to live link.</p></div><span className="cat-count">01 project</span></div>
<div className="cat-list"><article className="cs glass">
<div className="cs-top">
<span className="cs-num">01</span>
<div className="cs-name"><span className="cs-kicker">Personal · 2026</span><h3 className="cs-title">Portfolio website</h3></div>
<div className="cs-tags"><span className="chip">Brand identity</span><span className="chip">Web design</span><span className="chip">Front end</span></div>
</div>
<div className="cs-body">
<div className="cs-visual"><div className="browser">
<div className="browser-bar"><i></i><i></i><i></i><span>hamdan-portfolio-three.vercel.app</span></div>
<Image src={siteShot} alt="Screenshot of the portfolio home page with the spinning business card held by a hand" sizes="(max-width: 900px) 92vw, 58vw" />
</div></div>
<div className="cs-text">
<div className="cs-block"><h4>Overview</h4><p>My personal portfolio, designed and coded from scratch, with its own brand: logo, colours and type. A dark, calm look with a 3D business card that a hand presents and spins as you scroll.</p></div>
<div className="cs-block"><h4>The goal</h4><p>Show my design and build work clearly, in a site that is my own and not a template, and keep it smooth on a phone.</p></div>
<div className="cs-block"><h4>What&apos;s inside</h4><ol className="cs-steps"><li><span>01</span><p>A scroll driven 3D business card held by a hand</p></li><li><span>02</span><p>A sideways timeline that breaks into dust at the end</p></li><li><span>03</span><p>A moving WebGL wall of my design work</p></li><li><span>04</span><p>Scroll effects run on the graphics chip so phones stay smooth</p></li></ol></div>
<div className="cs-block"><h4>Built with</h4><div className="cs-chips"><span className="chip">Next.js</span><span className="chip">TypeScript</span><span className="chip">Three.js</span><span className="chip">Lenis</span><span className="chip">Vercel</span></div></div>
<div className="cs-foot"><span className="cs-status"><i></i>Live</span><div className="cs-links"><Link href="/">Visit site <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg></Link><a href="https://github.com/hamdanxo/Hamdan-Portfolio" target="_blank" rel="noopener">View code <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg></a></div></div>
</div>
</div>
<BrandBoard />
</article></div>
</section>
    </>
  );
}
