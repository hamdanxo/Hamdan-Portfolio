'use client';

import { finePointer, prefersReducedMotion } from '@/lib/motion';
import { useIdleEffect } from '@/lib/useIdleEffect';

/** Glow cursor and magnetic buttons, for mouse users only. */
export default function Cursor({ magnetic }: { magnetic: string }) {
  useIdleEffect(() => {
    if (prefersReducedMotion() || !finePointer()) return;
    const c = document.createElement('div');
    c.className = 'cur';
    c.setAttribute('aria-hidden', 'true');
    c.innerHTML = '<span>View</span>';
    document.body.appendChild(c);
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY; c.classList.add('on');
      // Over work (images, design tiles, list rows) the circle becomes a "View" label.
      c.classList.toggle('view', !!(e.target as Element | null)?.closest?.('[data-cursor="view"], .dg-stage.dg-pick'));
    };
    const leave = () => c.classList.remove('on');
    const over = (e: PointerEvent) => c.classList.toggle('big', !!(e.target as Element | null)?.closest?.('a,button'));
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    document.addEventListener('pointerover', over);
    const loop = () => {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      c.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const buttons = Array.from(document.querySelectorAll<HTMLElement>(magnetic));
    const cleanups = buttons.map((b) => {
      b.style.transition = 'transform .45s cubic-bezier(.2,.7,.2,1)';
      const pm = (e: PointerEvent) => {
        const r = b.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        b.style.transform = `translate(${(dx * 0.25).toFixed(1)}px,${(dy * 0.3).toFixed(1)}px)`;
      };
      const pl = () => { b.style.transform = ''; };
      b.addEventListener('pointermove', pm);
      b.addEventListener('pointerleave', pl);
      return () => { b.removeEventListener('pointermove', pm); b.removeEventListener('pointerleave', pl); };
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointerover', over);
      cleanups.forEach((f) => f());
      c.remove();
    };
  }, [magnetic]);

  return null;
}
