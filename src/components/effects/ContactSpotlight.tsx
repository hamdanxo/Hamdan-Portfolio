'use client';

import { prefersReducedMotion } from '@/lib/motion';
import { useIdleEffect } from '@/lib/useIdleEffect';

/** Light and arc in the contact card follow the pointer. */
export default function ContactSpotlight() {
  useIdleEffect(() => {
    const el = document.getElementById('contactCard');
    if (!el) return;
    const reduce = prefersReducedMotion();
    let tx = 0.3, ty = 0.4, x = 0.3, y = 0.4, run = false, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      el.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`);
      el.style.setProperty('--my', `${(y * 100).toFixed(2)}%`);
      if (!reduce) {
        el.style.setProperty('--dx', `${((x - 0.5) * -60).toFixed(1)}px`);
        el.style.setProperty('--dy', `${((y - 0.5) * -40).toFixed(1)}px`);
        el.style.setProperty('--hue', `${((x - 0.5) * 50).toFixed(1)}deg`);
      }
      if (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) raf = requestAnimationFrame(loop);
      else run = false;
    };
    const kick = () => { if (!run) { run = true; raf = requestAnimationFrame(loop); } };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; kick();
    };
    const leave = () => { tx = 0.3; ty = 0.4; kick(); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
