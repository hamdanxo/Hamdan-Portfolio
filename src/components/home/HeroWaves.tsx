'use client';

import { useEffect, useRef } from 'react';

/** The hero's light waves: each layer is its own image so they can draw in one after another when the page opens. */
type Layer = { src: string; x: number; y: number; w: number; h: number; k: 'up' | 'low' | 'glow' | 'main' | 'hot'; d: number };

const LAYERS: Layer[] = [
  { src: '/hero/waves/00.webp', x: 38.802, y: 0.0, w: 61.198, h: 22.333, k: 'up', d: 1.33 },
  { src: '/hero/waves/01.webp', x: 30.885, y: 0.0, w: 69.115, h: 27.917, k: 'up', d: 1.17 },
  { src: '/hero/waves/02.webp', x: 23.542, y: 0.0, w: 76.458, h: 33.583, k: 'up', d: 1.01 },
  { src: '/hero/waves/03.webp', x: 16.562, y: 0.0, w: 83.438, h: 39.25, k: 'up', d: 0.85 },
  { src: '/hero/waves/04.webp', x: 9.844, y: 0.0, w: 90.156, h: 44.917, k: 'up', d: 0.69 },
  { src: '/hero/waves/05.webp', x: 3.333, y: 0.0, w: 96.667, h: 50.667, k: 'up', d: 0.53 },
  { src: '/hero/waves/06.webp', x: 0.0, y: 76.083, w: 42.031, h: 23.917, k: 'low', d: 1.41 },
  { src: '/hero/waves/07.webp', x: 0.0, y: 69.583, w: 49.062, h: 30.417, k: 'low', d: 1.25 },
  { src: '/hero/waves/08.webp', x: 0.0, y: 63.0, w: 55.417, h: 37.0, k: 'low', d: 1.09 },
  { src: '/hero/waves/09.webp', x: 0.0, y: 56.417, w: 61.302, h: 43.583, k: 'low', d: 0.93 },
  { src: '/hero/waves/10.webp', x: 0.0, y: 49.833, w: 66.771, h: 50.167, k: 'low', d: 0.77 },
  { src: '/hero/waves/11.webp', x: 0.0, y: 43.333, w: 71.979, h: 56.667, k: 'low', d: 0.61 },
  { src: '/hero/waves/12.webp', x: 0.0, y: 36.75, w: 76.927, h: 63.25, k: 'low', d: 0.45 },
  { src: '/hero/waves/13.webp', x: 0.0, y: 0.0, w: 100.0, h: 100.0, k: 'glow', d: 0.10 },
  { src: '/hero/waves/14.webp', x: 0.0, y: 0.0, w: 100.0, h: 100.0, k: 'main', d: 0.00 },
  { src: '/hero/waves/15.webp', x: 13.906, y: 31.25, w: 52.188, h: 23.5, k: 'hot', d: 1.10 },
];

export default function HeroWaves() {
  const ref = useRef<HTMLDivElement>(null);
  // Start only once every layer has loaded and decoded, so nothing pops in late.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const go = () => { if (!done) { done = true; requestAnimationFrame(() => el.classList.add('wv-go')); } };
    const imgs = Array.from(el.querySelectorAll('img'));
    Promise.all(imgs.map((im) => (im.complete && im.naturalWidth ? im.decode?.().catch(() => {}) : new Promise<void>((r) => { im.onload = im.onerror = () => r(); })))).then(go);
    const t = window.setTimeout(go, 3000);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div className="wv" ref={ref} aria-hidden="true">
      <div className="wv-art">
        {LAYERS.map((l) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={l.src}
            className={`wv-l wv-${l.k}`}
            src={l.src}
            alt=""
            decoding="async"
            loading="eager"
            fetchPriority={l.k === 'main' ? 'high' : 'auto'}
            style={{ left: `${l.x}%`, top: `${l.y}%`, width: `${l.w}%`, height: `${l.h}%`, ['--d' as string]: `${l.d}s` }}
          />
        ))}
      </div>
      <div className="wv-scrim" />
    </div>
  );
}
