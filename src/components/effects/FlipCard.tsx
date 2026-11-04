'use client';

import { prefersReducedMotion } from '@/lib/motion';
import { useIdleEffect } from '@/lib/useIdleEffect';

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Drives the hero: lays out the hand + card for the screen shape,
 * keeps the card text crisp (--k scale) and spins the card with scroll.
 */
export default function FlipCard() {
  useIdleEffect(() => {
    const sec = document.getElementById('card');
    const box = document.getElementById('flipBox');
    const card = document.getElementById('flipCard');
    const inner = document.getElementById('flipInner');
    const ht = document.getElementById('heroText');
    if (!sec || !box || !card || !inner || !ht) return;
    const reduce = prefersReducedMotion();

    const layout = () => {
      const vw = window.innerWidth, vh = window.innerHeight, stack = vw <= 900 || vw / vh < 1.15;
      document.documentElement.classList.toggle('hero-stack', stack);
      document.documentElement.classList.toggle('hero-short', vh < 1000);
      if (!stack) { box.removeAttribute('style'); return; }
      let tb = 0;
      for (const c of Array.from(ht.children) as HTMLElement[]) if (c.offsetHeight) tb = Math.max(tb, c.offsetTop + c.offsetHeight);
      tb += ht.offsetTop;
      let w = Math.min(vw * 0.88, 560) / 0.42;
      const hMax = (vh - 18 - tb) / 0.86;
      w = Math.max(Math.min(w, hMax * 1.5), vw * 0.8);
      const h = w / 1.5;
      box.style.cssText = `width:${w.toFixed(0)}px;left:${Math.min(vw / 2 - 0.355 * w, vw * 0.06).toFixed(0)}px;top:${(tb + 18 + 0.16 * h).toFixed(0)}px;right:auto;bottom:auto`;
    };
    const fit = () => { layout(); card.style.setProperty('--k', (card.clientWidth / 359).toFixed(4)); };
    document.fonts?.ready.then(fit);

    const target = () => {
      const r = sec.getBoundingClientRect(), span = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / span));
      return ease(Math.min(1, Math.max(0, (p - 0.05) / 0.8)));
    };
    const fine = window.matchMedia('(pointer: fine)').matches && window.innerWidth > 900;
    let cur = 0, last = -1, raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const rr = sec.getBoundingClientRect();
      if (rr.bottom < 0 || rr.top > window.innerHeight) return;
      const t = target();
      cur += (t - cur) * 0.09;
      if (Math.abs(t - cur) < 0.0005) cur = t;
      if (!fine && cur === last) return;
      last = cur;
      inner.style.setProperty('--ry', `${(cur * 540).toFixed(2)}deg`);
      inner.style.setProperty('--sh', `${(100 - ((cur * 3) % 1) * 100).toFixed(1)}%`);
      if (fine) inner.style.setProperty('--fy', `${(Math.sin(performance.now() / 1400) * 6).toFixed(2)}px`);
    };

    window.addEventListener('resize', fit);
    fit();
    if (!reduce) { cur = target(); raf = requestAnimationFrame(loop); }
    return () => { window.removeEventListener('resize', fit); cancelAnimationFrame(raf); };
  }, []);

  return null;
}
