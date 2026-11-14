'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/** Flies each logo from far away, through the middle of the screen and past you, one after another. */
export default function CreativeKitMotion() {
  useEffect(() => {
    const sec = document.getElementById('toolkit');
    if (!sec) return;
    const tools = Array.from(sec.querySelectorAll<HTMLElement>('.ck-tool'));
    const names = Array.from(sec.querySelectorAll<HTMLElement>('.ck-name'));
    const glow = sec.querySelector<HTMLElement>('.ck-glow');
    const num = sec.querySelector<HTMLElement>('.ck-n');
    const n = tools.length;
    if (prefersReducedMotion()) { sec.classList.add('ck-static'); return; }
    // Each logo comes in from a different spot around the middle, so they never queue up in a line.
    const spots = tools.map((_, i) => { const a = i * 2.39996; return { x: Math.cos(a), y: Math.sin(a) * 0.7 }; });
    const FLY = 0.82; // share of the scroll spent flying; the rest shows the whole kit at once
    let raf = 0, live = false, lastP = -1, lastI = -1;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const r = sec.getBoundingClientRect(), vh = window.innerHeight, vw = window.innerWidth;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      if (Math.abs(p - lastP) < 0.0003) return;
      lastP = p;
      const t = (p / FLY) * n; // which tool is in front, with a fraction
      const spread = Math.min(vw, 1400) * 0.34;
      tools.forEach((el, i) => {
        const d = t - i;             // < 0 still far away, 0..1 arriving at the middle, > 1 flying past
        if (d < -2.2 || d > 1.6 || p >= FLY) { el.style.opacity = '0'; return; }
        const z = d < 0 ? d * 1400 : d < 1 ? 0 : (d - 1) * 1800;
        const off = d < 1 ? Math.max(0, Math.min(1, -d * 0.6 + 0.25)) : (d - 1) * 2.2 + 0.25;
        const x = spots[i].x * spread * off, y = spots[i].y * spread * off;
        const rot = (1 - Math.min(1, Math.max(0, d + 0.4))) * 40 * (i % 2 ? 1 : -1);
        const op = d < 0 ? Math.max(0, 1 + d / 2.2) : d > 1 ? Math.max(0, 1 - (d - 1) / 0.6) : 1;
        const lit = d > -0.15 && d < 1.05;
        el.style.opacity = op.toFixed(3);
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${rot.toFixed(1)}deg)`;
        el.classList.toggle('on', lit);
      });
      const cur = p >= FLY ? -1 : Math.max(0, Math.min(n - 1, Math.floor(t + 0.1)));
      if (cur !== lastI) {
        lastI = cur;
        names.forEach((e, i) => e.classList.toggle('on', i === cur));
        if (num && cur >= 0) num.textContent = String(cur + 1).padStart(2, '0');
        if (glow) glow.style.setProperty('--c', cur >= 0 ? getComputedStyle(tools[cur]).getPropertyValue('--c') : '#df2531');
      }
      sec.classList.toggle('ck-all', p >= FLY);
    };
    const io = new IntersectionObserver(([e]) => {
      live = e.isIntersecting; cancelAnimationFrame(raf);
      if (live) { lastP = -1; raf = requestAnimationFrame(frame); }
    }, { rootMargin: '100px 0px' });
    io.observe(sec);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
