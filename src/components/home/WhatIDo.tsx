import { IsoArt, type Box } from './iso';
import WhatIDoMotion from './WhatIDoMotion';

const grid = (n: number, step: number, size: number, h: number, skip?: (i: number, j: number) => boolean) => {
  const out: Box[] = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (!skip?.(i, j)) out.push({ x: i * step, y: j * step, w: size, d: size, h });
  return out;
};

const items: { title: string; text: string; art: Box[]; label: string }[] = [
  {
    title: 'Print that gets kept',
    text: 'Brand material, social posts and ad creatives that look sharp on screen and in print.',
    label: 'Three standing sheets, the front one highlighted',
    art: [
      { x: 0, y: 0, w: 3.2, d: 0.22, h: 4.4 },
      { x: 0.5, y: 1.1, w: 3.2, d: 0.22, h: 3.6 },
      { x: 1, y: 2.2, w: 3.2, d: 0.22, h: 2.8, accent: true },
    ],
  },
  {
    title: 'Websites that feel quick',
    text: 'Fast, clean websites with smooth motion that work just as well on a phone.',
    label: 'A grid of tiles with one block lifted above the centre',
    art: [...grid(3, 1.9, 1.6, 0.22), { x: 1.9, y: 1.9, z: 0.7, w: 1.6, d: 1.6, h: 1.6, accent: true }],
  },
  {
    title: 'Marketing that gets seen',
    text: 'Social media and campaigns, from the first idea to the final post.',
    label: 'Four rising columns, the tallest highlighted',
    art: [1.2, 2, 2.9, 4].map((h, i) => ({ x: i * 1.3, y: 0, w: 1, d: 1, h, accent: i === 3 })),
  },
  {
    title: 'Systems behind the scenes',
    text: 'Simple tools and automations that take repetitive work off a team.',
    label: 'Three small blocks leading into one larger highlighted block',
    art: [
      { x: 0, y: 0.5, w: 0.9, d: 0.9, h: 0.9 },
      { x: 1.4, y: 0.5, w: 0.9, d: 0.9, h: 0.9 },
      { x: 2.8, y: 0.5, w: 0.9, d: 0.9, h: 0.9 },
      { x: 4.2, y: 0, w: 1.9, d: 1.9, h: 1.9, accent: true },
    ],
  },
];

/** Bento grid of line drawings: what I do, one box each. */
export default function WhatIDo() {
  return (
    <section className="wid" id="what" aria-label="What I do">
      <div className="wid-grid">
        {items.map((it) => (
          <article className="wid-cell" key={it.title}>
            <div className="wid-art"><IsoArt boxes={it.art} label={it.label} /></div>
            <h3 className="wid-title">{it.title}</h3>
            <p className="wid-text">{it.text}</p>
          </article>
        ))}
      </div>
      <WhatIDoMotion />
    </section>
  );
}
