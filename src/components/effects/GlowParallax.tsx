'use client';

import { finePointer, prefersReducedMotion } from '@/lib/motion';
import { useIdleEffect } from '@/lib/useIdleEffect';

/** Background glows drift slightly with scroll (desktop mouse only). */
export default function GlowParallax() {
  useIdleEffect(() => {
    const g = document.getElementById('glows');
    if (!g || prefersReducedMotion() || !finePointer() || window.innerWidth <= 900) return;
    let ly = -1, raf = 0;
    const loop = () => {
      const y = window.scrollY;
      if (y !== ly) { ly = y; g.style.transform = `translate3d(0,${(y * -0.12).toFixed(1)}px,0)`; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return null;
}
