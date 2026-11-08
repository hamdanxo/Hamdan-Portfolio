'use client';

import { useEffect } from 'react';

/** Gives the top bar a soft dark backing once the page has scrolled a little. */
export default function HeaderScroll() {
  useEffect(() => {
    const el = document.getElementById('siteHeader');
    if (!el) return;
    let on = false;
    const check = () => {
      const next = window.scrollY > 24;
      if (next !== on) { on = next; el.classList.toggle('scrolled', on); }
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);
  return null;
}
