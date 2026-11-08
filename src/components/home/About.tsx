import fs from 'node:fs';
import path from 'node:path';


// The Download CV button only appears once public/cv.pdf exists, so there is never a broken link.
const hasCv = fs.existsSync(path.join(process.cwd(), 'public', 'cv.pdf'));


export default function About() {
  return (
    <>
<section className="s-4ded6d" id="about">
<div className="s-70882f">
<p className="mono s-f0b806">About</p>
<h2 className="s-c6ed9c"><span className="h2l"><span>Developer, designer</span></span><span className="h2l"><span className="s-f032f1">and marketer.</span></span></h2>
<p className="c-b9 s-4c8a14">I&apos;m a Computer Science student at the University of Wollongong in Dubai, majoring in Big Data and AI. I like work that sits between design and engineering, where how something looks matters as much as how it runs.</p>
<p className="c-b9 s-4c8a14">At Lapiz Blue I look after graphic design and marketing, from company profiles to product launches. Before that I coordinated client events at Cheeky Monkeys and handled data work for The Mosbach Group. I&apos;m open to internships and volunteer roles where I can keep learning by doing.</p>
<dl className="ab-facts">
<div><dt>Based in</dt><dd>Dubai</dd></div>
<div><dt>Studying</dt><dd>UOWD, Big Data and AI</dd></div>
</dl>
{hasCv && <a className="cv-btn" href="/cv.pdf" download="Muhammad Hamdan CV.pdf">Download CV<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12" /><path d="m6 11 6 6 6-6" /><path d="M5 20h14" /></svg></a>}
</div>
</section>
    </>
  );
}
