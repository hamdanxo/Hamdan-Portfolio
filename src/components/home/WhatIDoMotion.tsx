'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/** When a box scrolls into view, its purple piece drops softly onto the others. */
export default function WhatIDoMotion() {
  useEffect(() => {
    const sec = document.getElementById('what');
    if (!sec || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    const cells = Array.from(sec.querySelectorAll<HTMLElement>('.wid-cell'));
    sec.classList.add('wid-anim');
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { threshold: 0.45 });
    cells.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);
  return null;
}
