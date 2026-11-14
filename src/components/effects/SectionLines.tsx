'use client';

import { useEffect } from 'react';

/** A thin red line draws across the screen where each section starts. */
export default function SectionLines({ ids }: { ids: string[] }) {
  useEffect(() => {
    const made: HTMLElement[] = [];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -15% 0px' });
    ids.forEach((id) => {
      const s = document.getElementById(id);
      if (!s || !s.parentElement) return;
      const l = document.createElement('div');
      l.className = 'sec-line';
      l.setAttribute('aria-hidden', 'true');
      l.innerHTML = '<i></i>';
      s.parentElement.insertBefore(l, s);
      made.push(l);
      io.observe(l);
    });
    return () => { io.disconnect(); made.forEach((l) => l.remove()); };
  }, [ids]);
  return null;
}
