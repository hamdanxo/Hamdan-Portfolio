import Image from 'next/image';
import siteShot from '@/assets/site-shot.webp';
import { categories, work, type Category } from '@/data/designs';

const inCat = (c: Category) => work.filter((d) => d.category === c);
const countLabel = (c: Category) => {
  const n = inCat(c).length, unit = categories.find((x) => x.id === c)!.unit;
  return `${String(n).padStart(2, '0')} ${n === 1 ? unit[0] : unit[1]}`;
};
const pad = (n: number) => String(n).padStart(2, '0');

// Printed profiles lying on a desk: three covers and one inside page from each.
const DESK = [
  { k: 'a', src: '/designs/lapiz-blue-profile/p01.webp' },
  { k: 'b', src: '/designs/global-classic-profile/p01.webp' },
  { k: 'c', src: '/designs/sahihi-profile/p06.webp' },
  { k: 'd', src: '/designs/lapiz-blue-profile/p10.webp' },
  { k: 'e', src: '/designs/global-classic-profile/p02.webp' },
  { k: 'f', src: '/designs/sahihi-profile/p01.webp' },
];

export default function Projects() {
  return (
    <>
<section className="s-0ccb30" id="projects">
<div className="s-20db00">
<div className="s-e12feb">
<p className="mono s-f0b806">Projects</p>
<h2 className="s-ef1980"><span className="h2l"><span>Selected work</span></span></h2>
</div>
<p className="c-b9 s-036481">Three areas I work in. Open one to see the projects, or <a className="see-all" href="/work">see all work</a>.</p>
</div>
<div className="pj-stack">
<article className="pj s-c5cbe4">
<div className="pj-head">
<div className="pj-id"><span className="pj-num">01</span><div className="pj-meta"><span className="pj-client">{pad(work.length)} projects</span><h3 className="pj-title">Graphic Design</h3></div></div>
<a className="pj-link" href="/design">View projects <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg></a>
</div>
<a className="pj-grid pj-cats" data-cursor="view" href="/design" aria-label="Open Graphic Design projects">
<div className="pj-img pj-big pj-photo pj-desk">
<div className="pj-plane" aria-hidden="true">
{DESK.map((d) => (
<div className={`bk bk-${d.k}`} key={d.k}><Image src={d.src} alt="" fill sizes="(max-width: 900px) 30vw, 16vw" /></div>
))}
</div>
<span className="pj-cat"><em>{countLabel('profile')}</em>Company Profiles and Catalogues</span>
</div>
<div className="pj-img pj-photo"><Image src="/designs/fuga-shock/01.webp" alt="Fuga-Shock launch ad for Lapiz Blue" fill sizes="(max-width: 900px) 46vw, 30vw" /><span className="pj-cat"><em>{countLabel('ad')}</em>Ad Creatives</span></div>
<div className="pj-img pj-photo"><Image src="/designs/stone-collections/01.webp" alt="Stone Collections post for Global Classic" fill sizes="(max-width: 900px) 46vw, 30vw" /><span className="pj-cat"><em>{countLabel('social')}</em>Social Media</span></div>
</a>
<span className="pj-dim" aria-hidden="true" />
</article>
<article className="pj s-3ea882">
<div className="pj-head">
<div className="pj-id"><span className="pj-num">02</span><div className="pj-meta"><span className="pj-client">01 project</span><h3 className="pj-title">Websites</h3></div></div>
<a className="pj-link" href="/work#websites">View projects <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg></a>
</div>
<a className="pj-grid" data-cursor="view" href="/work#websites" aria-label="Open Websites projects">
<div className="pj-img pj-big"><Image className="s-96d9c8" src={siteShot} alt="Portfolio website home page" sizes="(max-width: 900px) 92vw, 62vw" /></div>
<div className="pj-img pj-soon">Next site</div>
<div className="pj-img pj-soon">Next site</div>
</a>
<span className="pj-dim" aria-hidden="true" />
</article>
<article className="pj s-b9d41c">
<div className="pj-head">
<div className="pj-id"><span className="pj-num">03</span><div className="pj-meta"><span className="pj-client">01 project</span><h3 className="pj-title">Automations &amp; Systems</h3></div></div>
<a className="pj-link" href="/work#automations">View projects <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg></a>
</div>
<a className="pj-grid" data-cursor="view" href="/work#automations" aria-label="Open Automations & Systems projects">
<div className="pj-img pj-big pj-live"><div className="flow" aria-label="How the lead staging system works">
<div className="flow-row">
<div className="node"><span className="node-k">Source</span><b>Counter form</b><small>Walk in enquiries</small></div>
<div className="node"><span className="node-k">Source</span><b>Leads inbox</b><small>Email enquiries</small></div>
<div className="node node-ghost"><span className="node-k">Next</span><b>WhatsApp</b><small>Planned</small></div>
</div>
<div className="flow-line" aria-hidden="true"></div>
<div className="node node-main">
<div className="node-headrow"><span className="node-k">Staging area</span><span className="node-tag">Sample draft</span></div>
<b>Review before it counts</b>
<small>AI pre-fills the details, the team checks and edits</small>
<div className="draft">
<div><span>Company</span><em>Sample Contracting LLC</em></div>
<div><span>Salesman</span><em>Auto assigned</em></div>
<div><span>Source</span><em>Email</em></div>
<div><span>Quantity</span><em>120 bags</em></div>
</div>
<div className="draft-btn">Push to CRM</div>
</div>
<div className="flow-line" aria-hidden="true"></div>
<div className="node"><span className="node-k">Destination</span><b>Zoho CRM</b><small>One click, assigned to the next salesman in turn</small></div>
<div className="flow-line flow-line-dim" aria-hidden="true"></div>
<div className="node node-ghost"><span className="node-k">In progress</span><b>Reports</b><small>By week, month, salesman and brand</small></div>
</div></div>
<div className="pj-img pj-soon">Next system</div>
<div className="pj-img pj-soon">Next system</div>
</a>
<span className="pj-dim" aria-hidden="true" />
</article>
</div>
</section>
    </>
  );
}
