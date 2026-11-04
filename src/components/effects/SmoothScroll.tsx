'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { prefersReducedMotion } from '@/lib/motion';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Momentum scrolling with Lenis, plus smooth in-page anchor links. */
export default function SmoothScroll({ offset = -90 }: { offset?: number }) {
  useEffect(() => {
    const reduce = prefersReducedMotion();
    if (!reduce && 'IntersectionObserver' in window) document.documentElement.classList.add('js-anim');
    if (reduce) return;

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.2 });
    window.__lenis = lenis;
    let raf = 0;
    const tick = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href') ?? '';
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset, duration: 1.6 });
    };
    document.addEventListener('click', onClick);

    // Arriving from another page with a hash (for example /#about)
    if (location.hash.length > 1) {
      const el = document.querySelector(location.hash);
      if (el) requestAnimationFrame(() => lenis.scrollTo(el as HTMLElement, { offset, immediate: true }));
    }

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [offset]);

  return null;
}
