import Image from 'next/image';
import hand from '@/assets/hand.webp';
import HeroLayoutScript from '@/components/effects/HeroLayoutScript';

export default function Hero() {
  return (
    <>
<section className="flip" id="card" aria-label="Business card">
<div className="flip-pin">
<div className="hero-text" id="heroText">
<span className="glass mono s-23a2fd"><span className="s-63150a"></span>Open to internships</span>
<h1 className="s-9eabf6"><span className="hl"><span>Muhammad</span></span><span className="hl"><span className="s-33dd4a"><em className="serif">Hamdan</em><span className="s-1b96e3">.</span></span></span></h1>
<p className="mono s-3fb4e3"><span>Web Developer</span><span className="s-a80552" aria-hidden="true">/</span><span>Graphic Designer</span><span className="s-a80552" aria-hidden="true">/</span><span>Marketing</span></p>
<p className="hero-intro c-b9 s-084c17">Computer Science student at the University of Wollongong in Dubai, studying Big Data and AI. I build websites, design graphics and run marketing and social media.</p>
<div className="s-c64adb">
<a className="s-98d8a6" href="#about">About me
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path></svg></a>
<a className="glass s-54bb11" href="#contact">Get in touch</a>
</div>
</div>
<div className="flip-box" id="flipBox" suppressHydrationWarning>
<Image className="hand" src={hand} alt="" aria-hidden="true" priority fetchPriority="high" sizes="(max-width: 900px) 140vw, 64vw" />
<div className="palm-glow" aria-hidden="true"></div>
<div className="flip-card" id="flipCard" suppressHydrationWarning>
<div className="flip-inner" id="flipInner">
<div className="face front s-53b30b"><div className="sheen" aria-hidden="true"></div>
<div className="s-ae999a" aria-hidden="true"></div>
<div className="s-6bb8e7" aria-hidden="true"></div>
<div className="s-298997" aria-hidden="true"></div>
<div className="grain s-c5f564" aria-hidden="true"></div>
<p className="card-time" id="cardTime" aria-hidden="true" suppressHydrationWarning>Dubai</p>
<p className="s-7c3ca0">Crafting Dreams Into Reality</p>
<div className="s-a5484f"><span className="s-65a69d foil" id="cardFoil">MH</span><span className="s-e7b62d" aria-hidden="true"></span></div>
</div>
<div className="face back s-e934a4"><div className="sheen" aria-hidden="true"></div>
<div className="grain s-05a88a" aria-hidden="true"></div>
<div className="s-8812ca"><span className="s-38f477">MUHAMMAD<br />HAMDAN</span><span className="s-d07711" aria-hidden="true"></span></div>
<div className="s-04671c">
<span>hamdansameer2005@gmail.com</span>
<span className="s-02a2d3">Web Developer<br />Graphic Designer<br />Marketing</span>
<span className="s-f9cff0"><span>+971 55 800 5474</span><span className="s-c38a8c"><svg className="s-0e446f" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"></circle></svg>@xvii.hamdan</span><span className="s-d29fc4">hamdanxo.github.io/Portfolio</span></span>
</div>
<a className="card-save" href="/muhammad-hamdan.vcf" download="Muhammad Hamdan.vcf" aria-label="Save Muhammad Hamdan to your contacts"><span>Tap to save contact</span></a>
</div>
</div>
</div>
</div>
</div>
<HeroLayoutScript />
</section>
    </>
  );
}
