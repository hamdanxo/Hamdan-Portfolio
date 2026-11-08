'use client';

import { prefersReducedMotion } from '@/lib/motion';
import { useIdleEffect } from '@/lib/useIdleEffect';

/** Words in the statement light up one by one as the section scrolls through the screen. */
export default function ScrollFill({ id }: { id: string }) {
  useIdleEffect(() => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const words = Array.from(sec.querySelectorAll<HTMLElement>('.fw'));
    if (prefersReducedMotion()) { words.forEach((w) => w.classList.add('lit')); return; }
    let raf = 0, lastN = -1;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const r = sec.getBoundingClientRect(), vh = window.innerHeight;
      // 0 when the top of the text reaches 85% down the screen, 1 when its bottom reaches 45%.
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.4)));
      const n = Math.round(p * words.length);
      if (n === lastN) return;
      lastN = n;
      words.forEach((w, i) => w.classList.toggle('lit', i < n));
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [id]);
  return null;
}
