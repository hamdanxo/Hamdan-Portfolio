'use client';

import { useEffect, useRef } from 'react';

/** Computers only: a soft red-purple light that trails the mouse, as if the hero glow lights up whatever you point at. */
export default function CursorLight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty, raf = 0, moving = false;
    const loop = () => {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      el.style.transform = `translate3d(${(x - 450).toFixed(1)}px,${(y - 450).toFixed(1)}px,0)`;
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.5) raf = requestAnimationFrame(loop); else moving = false;
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY; el.classList.add('on');
      if (!moving) { moving = true; raf = requestAnimationFrame(loop); }
    };
    const leave = () => el.classList.remove('on');
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); };
  }, []);
  return <div className="cursor-light" ref={ref} aria-hidden="true" />;
}
