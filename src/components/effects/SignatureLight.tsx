'use client';

import { useEffect } from 'react';

/** The big signature at the bottom: a red light follows the mouse across the letters. */
export default function SignatureLight() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>('.wordmark.sig');
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0, tx = 50, ty = 50;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100; ty = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; el.style.setProperty('--sx', `${tx.toFixed(1)}%`); el.style.setProperty('--sy', `${ty.toFixed(1)}%`); el.classList.add('lit'); });
    };
    const leave = () => el.classList.remove('lit');
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
