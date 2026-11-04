'use client';

import { prefersReducedMotion } from '@/lib/motion';
import { useIdleEffect } from '@/lib/useIdleEffect';

/** Project cards shrink and dim as the next one stacks over them. */
export default function ProjectStack() {
  useIdleEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.pj'));
    if (cards.length < 2 || prefersReducedMotion()) return;
    let ticking = false;
    const upd = () => {
      ticking = false;
      const vh = window.innerHeight;
      for (let i = 0; i < cards.length - 1; i++) {
        const gap = cards[i + 1].getBoundingClientRect().top - cards[i].getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, 1 - (gap - 26) / (vh * 0.75)));
        cards[i].style.setProperty('--sc', (1 - p * 0.07).toFixed(4));
        cards[i].style.setProperty('--dim', (p * 0.45).toFixed(3));
      }
    };
    const on = () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    upd();
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  return null;
}
