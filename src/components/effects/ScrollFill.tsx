'use client';

import { prefersReducedMotion } from '@/lib/motion';
import { useIdleEffect } from '@/lib/useIdleEffect';

/**
 * The statement stays pinned while you scroll; words come out of a blur one by one,
 * a red light follows the word being written, and a thin bar shows how far you are.
 */
export default function ScrollFill({ id }: { id: string }) {
  useIdleEffect(() => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const words = Array.from(sec.querySelectorAll<HTMLElement>('.fw'));
    const glow = sec.querySelector<HTMLElement>('.stmt-glow');
    const bar = sec.querySelector<HTMLElement>('.stmt-bar b');
    const num = sec.querySelector<HTMLElement>('.stmt-n');
    const pin = sec.querySelector<HTMLElement>('.stmt-pin');
    if (prefersReducedMotion()) { words.forEach((w) => w.classList.add('lit')); sec.classList.add('stmt-static'); return; }
    let raf = 0, lastN = -1, live = false;
    const loop = () => {
      if (!live) return;
      raf = requestAnimationFrame(loop);
      const r = sec.getBoundingClientRect(), vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      const n = Math.round(Math.min(1, p / 0.85) * words.length);
      if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
      if (n === lastN) return;
      lastN = n;
      words.forEach((w, i) => w.classList.toggle('lit', i < n));
      if (num) num.textContent = String(Math.round((n / words.length) * 100)).padStart(2, '0');
      const cur = words[Math.max(0, Math.min(words.length - 1, n - 1))];
      if (glow && pin && cur) {
        const a = cur.getBoundingClientRect(), b = pin.getBoundingClientRect();
        glow.style.transform = `translate3d(${(a.left - b.left + a.width / 2).toFixed(0)}px,${(a.top - b.top + a.height / 2).toFixed(0)}px,0) translate(-50%,-50%)`;
        glow.style.opacity = n > 0 && n < words.length ? '1' : n >= words.length ? '.55' : '0';
      }
      sec.classList.toggle('stmt-done', n >= words.length);
    };
    const io = new IntersectionObserver(([e]) => {
      live = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (live) raf = requestAnimationFrame(loop);
    }, { rootMargin: '20% 0px' });
    io.observe(sec);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [id]);
  return null;
}
