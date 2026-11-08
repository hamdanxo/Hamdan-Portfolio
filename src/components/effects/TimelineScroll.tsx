'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/** As you scroll past the experience timeline, the line fills down and each role lights up when the fill reaches it. */
export default function TimelineScroll() {
  useEffect(() => {
    const tl = document.getElementById('timeline');
    if (!tl) return;
    const fill = tl.querySelector<HTMLElement>('.tl-fill');
    const track = tl.querySelector<HTMLElement>('.tl-track');
    const rows = Array.from(tl.querySelectorAll<HTMLElement>('.tl-row'));
    if (!fill || !track || !rows.length) return;
    // Run the line from the first dot to the last one, whatever the screen size.
    const place = () => {
      const box = tl.getBoundingClientRect();
      const first = rows[0].querySelector<HTMLElement>('.tl-dot')?.getBoundingClientRect();
      const lastDot = rows[rows.length - 1].querySelector<HTMLElement>('.tl-dot')?.getBoundingClientRect();
      if (!first || !lastDot) return;
      track.style.left = `${(first.left + first.width / 2 - box.left).toFixed(1)}px`;
      track.style.top = `${(first.top + first.height / 2 - box.top).toFixed(1)}px`;
      track.style.bottom = 'auto';
      track.style.height = `${(lastDot.top - first.top).toFixed(1)}px`;
    };
    place();
    window.addEventListener('resize', place);
    document.fonts?.ready.then(place);
    if (prefersReducedMotion()) { fill.style.transform = 'scaleY(1)'; rows.forEach((r) => r.classList.add('on')); return () => window.removeEventListener('resize', place); }
    let raf = 0, last = -1;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const t = track.getBoundingClientRect();
      // The fill follows a point 60% down the screen.
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - t.top) / t.height));
      if (Math.abs(p - last) < 0.001) return;
      last = p;
      fill.style.transform = `scaleY(${p.toFixed(4)})`;
      const reach = t.top + p * t.height;
      rows.forEach((r) => {
        const d = r.querySelector<HTMLElement>('.tl-dot');
        if (!d) return;
        const b = d.getBoundingClientRect();
        r.classList.toggle('on', reach >= b.top + b.height / 2);
      });
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', place); };
  }, []);
  return null;
}
