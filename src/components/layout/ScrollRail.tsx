'use client';

import { useEffect } from 'react';

/**
 * Phones and tablets: a slim scroll bar on the right edge that you can grab and drag,
 * so long pages (and the design wall) are easy to move through. Computers keep their normal scroll bar.
 */
export default function ScrollRail() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: coarse)').matches) return;
    const rail = document.createElement('div');
    rail.className = 'srail';
    rail.setAttribute('aria-hidden', 'true');
    const thumb = document.createElement('div');
    thumb.className = 'srail-thumb';
    rail.appendChild(thumb);
    document.body.appendChild(rail);

    let hide = 0, dragging = false, startY = 0, startScroll = 0;
    const metrics = () => {
      const vh = window.innerHeight, dh = document.documentElement.scrollHeight;
      const th = Math.max(56, (vh * vh) / Math.max(dh, 1));
      return { max: dh - vh, th, travel: vh - th - 16 };
    };
    const update = () => {
      const m = metrics();
      rail.style.display = m.max <= 4 ? 'none' : '';
      thumb.style.height = `${m.th.toFixed(0)}px`;
      thumb.style.transform = `translateY(${(8 + (window.scrollY / Math.max(m.max, 1)) * m.travel).toFixed(1)}px)`;
    };
    const show = () => {
      rail.classList.add('on');
      window.clearTimeout(hide);
      if (!dragging) hide = window.setTimeout(() => rail.classList.remove('on'), 1600);
    };
    const onScroll = () => { update(); show(); };
    const moveTo = (clientY: number) => {
      const m = metrics();
      window.scrollTo(0, startScroll + (clientY - startY) * (m.max / Math.max(m.travel, 1)));
    };
    const down = (e: PointerEvent) => {
      e.preventDefault();
      dragging = true;
      rail.classList.add('drag');
      const t = thumb.getBoundingClientRect();
      // Tapping the rail outside the thumb jumps there first.
      if (e.clientY < t.top || e.clientY > t.bottom) {
        const m = metrics();
        window.scrollTo(0, ((e.clientY - 8 - m.th / 2) / Math.max(m.travel, 1)) * m.max);
      }
      startY = e.clientY;
      startScroll = window.scrollY;
      rail.setPointerCapture(e.pointerId);
      show();
    };
    const move = (e: PointerEvent) => { if (dragging) moveTo(e.clientY); };
    const up = () => { if (!dragging) return; dragging = false; rail.classList.remove('drag'); show(); };

    rail.addEventListener('pointerdown', down);
    rail.addEventListener('pointermove', move);
    rail.addEventListener('pointerup', up);
    rail.addEventListener('pointercancel', up);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    update();
    return () => {
      window.clearTimeout(hide);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      ro.disconnect();
      rail.remove();
    };
  }, []);
  return null;
}
