import { IsoArt, type Box } from './iso';

const grid = (n: number, step: number, size: number, h: number, skip?: (i: number, j: number) => boolean) => {
  const out: Box[] = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (!skip?.(i, j)) out.push({ x: i * step, y: j * step, w: size, d: size, h });
  return out;
};

const cubes27 = (): Box[] => {
  const out: Box[] = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) {
    const top = i === 1 && j === 1 && k === 2;
    out.push({ x: i * 0.95, y: j * 0.95, z: k * 0.95 + (top ? 1.25 : 0), w: 0.8, d: 0.8, h: 0.8, accent: top });
  }
  return out;
};

const items: { title: string; text: string; art: Box[]; label: string }[] = [
  {
    title: 'Print that gets kept',
    text: 'Company profiles, social posts and ad creatives for Lapiz Blue and Global Classic.',
    label: 'Three standing sheets, the front one highlighted',
    art: [
      { x: 0, y: 0, w: 3.2, d: 0.22, h: 4.4 },
      { x: 0.5, y: 1.1, w: 3.2, d: 0.22, h: 3.6 },
      { x: 1, y: 2.2, w: 3.2, d: 0.22, h: 2.8, accent: true },
    ],
  },
  {
    title: 'Websites that feel quick',
    text: 'I build sites like this one in Next.js, with motion that stays smooth on a phone.',
    label: 'A grid of tiles with one block lifted above the centre',
    art: [...grid(3, 1.9, 1.6, 0.22), { x: 1.9, y: 1.9, z: 0.7, w: 1.6, d: 1.6, h: 1.6, accent: true }],
  },
  {
    title: 'Marketing that gets seen',
    text: 'I run the social media and marketing at Lapiz Blue, from the idea to the final post.',
    label: 'Four rising columns, the tallest highlighted',
    art: [1.2, 2, 2.9, 4].map((h, i) => ({ x: i * 1.3, y: 0, w: 1, d: 1, h, accent: i === 3 })),
  },
  {
    title: 'Systems behind the scenes',
    text: 'A lead tool that turns emails and walk in enquiries into clean Zoho CRM leads.',
    label: 'Three small blocks leading into one larger highlighted block',
    art: [
      { x: 0, y: 0.5, w: 0.9, d: 0.9, h: 0.9 },
      { x: 1.4, y: 0.5, w: 0.9, d: 0.9, h: 0.9 },
      { x: 2.8, y: 0.5, w: 0.9, d: 0.9, h: 0.9 },
      { x: 4.2, y: 0, w: 1.9, d: 1.9, h: 1.9, accent: true },
    ],
  },
  {
    title: 'Big Data and AI',
    text: 'Computer Science at the University of Wollongong in Dubai, focused on data and AI.',
    label: 'A cube made of small cubes with the top centre one lifted out',
    art: cubes27(),
  },
  {
    title: 'Based in Dubai',
    text: 'Working in English, Urdu and Hindi, in a team or on my own.',
    label: 'A small skyline with one tall highlighted tower',
    art: [
      { x: 0, y: 0, w: 1, d: 1, h: 2.2 },
      { x: 1.2, y: 0, w: 1, d: 1, h: 3.4 },
      { x: 2.4, y: 0, w: 1, d: 1, h: 1.6 },
      { x: 0, y: 1.2, w: 1, d: 1, h: 1.4 },
      { x: 1.3, y: 1.3, w: 0.8, d: 0.8, h: 5.4, accent: true },
      { x: 2.4, y: 1.2, w: 1, d: 1, h: 2.6 },
      { x: 0.6, y: 2.4, w: 1, d: 1, h: 1 },
      { x: 1.8, y: 2.4, w: 1, d: 1, h: 1.8 },
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
    </section>
  );
}
