'use client';

import { useEffect } from 'react';
import { prefersReducedMotion, scrollAnim, type ScrollAnim } from '@/lib/motion';

/**
 * About on a screen: as you scroll, the monitor rises and zooms in, the left side of the screen appears,
 * then the words on the right light up one after another, like they are being typed in.
 */
export default function AboutMotion() {
  useEffect(() => {
    const sec = document.getElementById('about');
    const dev = sec?.querySelector<HTMLElement>('.ab3-dev');
    const left = sec?.querySelector<HTMLElement>('.ab3-l');
    const box = sec?.querySelector<HTMLElement>('.ab3-r');
    const rin = sec?.querySelector<HTMLElement>('.ab3-rin');
    if (!sec || !dev || !left || !box || !rin) return;
    const heads = Array.from(sec.querySelectorAll<HTMLElement>('.ab3-hw, .ab3-k'));
    const ws = Array.from(sec.querySelectorAll<HTMLElement>('.ab3-w, .ab3-cv'));
    if (prefersReducedMotion()) { sec.classList.add('ab3-static'); return; }

    const anim: ScrollAnim = scrollAnim(dev, sec, [
      { offset: 0, transform: 'translate3d(0,38vh,0) scale(.6)', opacity: 0 },
      { offset: 0.07, opacity: 1 },
      { offset: 0.24, transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
      { offset: 1, transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
    ]);

    let raf = 0, live = false, lastH = -1, lastW = -1, lastL = false;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const r = sec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      anim.set(p);
      const l = p > 0.25;
      if (l !== lastL) { lastL = l; left.classList.toggle('on', l); }
      const h = Math.round(Math.min(1, Math.max(0, (p - 0.3) / 0.12)) * heads.length);
      if (h !== lastH) { lastH = h; heads.forEach((e, i) => e.classList.toggle('on', i < h)); }
      const w = Math.round(Math.min(1, Math.max(0, (p - 0.42) / 0.48)) * ws.length);
      if (w !== lastW) {
        lastW = w; ws.forEach((e, i) => e.classList.toggle('on', i < w));
        // Small screens: the text scrolls up inside the monitor so the line being written stays in view.
        const extra = rin.scrollHeight - box.clientHeight;
        if (extra > 4 && w > 0) {
          const cur = ws[Math.min(w, ws.length) - 1];
          const y = Math.min(extra, Math.max(0, cur.offsetTop - box.clientHeight * 0.55));
          rin.style.transform = `translate3d(0,${-y}px,0)`;
        } else rin.style.transform = '';
      }
    };
    const io = new IntersectionObserver((es) => {
      if (es[0].isIntersecting && !live) { live = true; raf = requestAnimationFrame(frame); }
      else if (!es[0].isIntersecting && live) { live = false; cancelAnimationFrame(raf); }
    }, { rootMargin: '200px 0px' });
    io.observe(sec);
    return () => { io.disconnect(); cancelAnimationFrame(raf); anim.anim.cancel(); };
  }, []);
  return null;
}
