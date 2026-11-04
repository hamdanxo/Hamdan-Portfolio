'use client';

import { prefersReducedMotion } from '@/lib/motion';
import { useIdleEffect } from '@/lib/useIdleEffect';

/**
 * Soft fade-in for elements matching `selector` as they enter the viewport.
 * Siblings are staggered. Content stays visible without JavaScript.
 */
export default function Reveal({ selector, className = 'rv', stagger = 0.12 }: { selector: string; className?: string; stagger?: number }) {
  useIdleEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const vh = window.innerHeight;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    for (const el of els) {
      // Never hide what is already on screen at load: keeps LCP fast.
      if (el.getBoundingClientRect().top < vh) continue;
      const sibs = el.parentElement ? Array.from(el.parentElement.children).filter((c) => els.includes(c as HTMLElement)) : [];
      el.style.setProperty('--d', `${(Math.max(0, sibs.indexOf(el)) * stagger).toFixed(2)}s`);
      el.classList.add(className);
      io.observe(el);
    }
    return () => io.disconnect();
  }, [selector, className, stagger]);

  return null;
}
