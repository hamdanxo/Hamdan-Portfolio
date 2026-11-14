'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/** Work page: paragraphs light up word by word as they come into view, like the home page. */
export default function WordLight({ selector }: { selector: string }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    els.forEach((el) => {
      if (el.dataset.wl) return;
      el.dataset.wl = '1';
      const words = (el.textContent || '').split(/\s+/).filter(Boolean);
      el.innerHTML = words.map((w, i) => `<span class="wl" style="transition-delay:${Math.min(i * 22, 900)}ms">${w.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`).join(' ');
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('wl-on'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector]);
  return null;
}
