'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Smooth page changes: clicking a link to another page fades and lifts the old page away while the new one
 * settles in (the browser's View Transitions). Tiles marked with the same view-transition-name, like the
 * Graphic Design card and the gallery, grow from one page into the other. Browsers without it just navigate.
 */
export default function PageTransitions() {
  const router = useRouter();
  const path = usePathname();
  const done = useRef<(() => void) | null>(null);

  // The new page has rendered: let the browser take its picture and play the transition.
  useEffect(() => {
    if (!done.current) return;
    const d = done.current;
    done.current = null;
    requestAnimationFrame(() => d());
  }, [path]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (typeof document.startViewTransition !== 'function') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || !a.href || a.hasAttribute('download')) return;
      if (a.target && a.target !== '_self') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      e.stopPropagation(); // keep Next's own link handler from navigating a second time
      const href = url.pathname + url.search + url.hash;
      document.startViewTransition(() => new Promise<void>((resolve) => {
        const t = window.setTimeout(resolve, 2500); // never hang if the page is slow
        done.current = () => { window.clearTimeout(t); resolve(); };
        router.push(href);
      }));
    };
    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, [router]);

  return null;
}
