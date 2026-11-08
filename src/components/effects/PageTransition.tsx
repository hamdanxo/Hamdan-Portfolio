'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/** Runs before first paint: if we arrived through a wipe, start with the screen covered. */
export const pageTransitionScript =
  "try{if(sessionStorage.getItem('pt')){document.documentElement.classList.add('pt-cover');sessionStorage.removeItem('pt')}}catch(e){}";

/**
 * Page change wipe: clicking a link to another page sweeps a panel in the card's colours
 * across the screen, the next page loads underneath, then the panel sweeps away.
 */
export default function PageTransition() {
  useEffect(() => {
    const el = document.getElementById('pt');
    if (!el) return;
    const root = document.documentElement;
    let t = 0;

    const reveal = () => {
      if (!root.classList.contains('pt-cover')) return;
      requestAnimationFrame(() => {
        root.classList.remove('pt-cover');
        el.classList.remove('in');
        el.classList.add('out');
        t = window.setTimeout(() => el.classList.remove('out'), 900);
      });
    };
    reveal();

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return; // files, not pages
      if (prefersReducedMotion()) return;
      e.preventDefault();
      el.classList.remove('out');
      el.classList.add('in');
      t = window.setTimeout(() => {
        try { sessionStorage.setItem('pt', '1'); } catch { /* storage blocked: the next page simply shows without the sweep */ }
        location.href = url.href;
      }, 560);
    };
    // Coming back with the browser's back button can restore the page with the panel still covering it.
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) { el.classList.remove('in', 'out'); root.classList.remove('pt-cover'); } };
    // Capture phase: runs before Next's own link handling, so every page change gets the sweep.
    document.addEventListener('click', onClick, true);
    window.addEventListener('pageshow', onShow);
    return () => { document.removeEventListener('click', onClick, true); window.removeEventListener('pageshow', onShow); window.clearTimeout(t); };
  }, []);
  return null;
}
