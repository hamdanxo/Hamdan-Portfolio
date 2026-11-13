'use client';

import { useEffect } from 'react';

/** Computers: a thin red line down the right edge that fills as you scroll the page. */
export default function ScrollLine() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = document.createElement('div');
    el.className = 'sline';
    el.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('i');
    el.appendChild(fill);
    document.body.appendChild(el);
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.transform = `scaleY(${(max > 0 ? window.scrollY / max : 0).toFixed(4)})`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); el.remove(); };
  }, []);
  return null;
}
