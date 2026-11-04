'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/** Category filter on the Work page, driven by the URL hash (#all, #websites, ...). */
export default function WorkTabs() {
  useEffect(() => {
    const reduce = prefersReducedMotion();
    const cats = Array.from(document.querySelectorAll<HTMLElement>('.cat'));
    const tabs = Array.from(document.querySelectorAll<HTMLAnchorElement>('.tabs a'));
    const wrap = document.querySelector<HTMLElement>('.tabs-wrap');
    let pending: string | null = null;

    const apply = (scroll: boolean) => {
      let f = pending ?? (location.hash || '#all').slice(1);
      pending = null;
      if (!cats.some((c) => c.dataset.cat === f)) f = 'all';
      cats.forEach((c) => { c.hidden = !(f === 'all' || c.dataset.cat === f); });
      tabs.forEach((t) => {
        const on = t.dataset.f === f;
        t.classList.toggle('on', on);
        if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
      });
      if (scroll && wrap) {
        const y = wrap.getBoundingClientRect().top + window.scrollY - 104;
        if (window.scrollY > y - 4) {
          if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
          else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
        }
      }
      window.dispatchEvent(new Event('worktabs:change'));
    };

    const handlers = tabs.map((t) => {
      const h = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const f = t.dataset.f ?? 'all';
        if (location.hash !== `#${f}`) {
          try { history.replaceState(null, '', `#${f}`); } catch { pending = f; }
        }
        apply(true);
      };
      t.addEventListener('click', h);
      return () => t.removeEventListener('click', h);
    });
    const onHash = () => apply(true);
    window.addEventListener('hashchange', onHash);
    apply(false);
    return () => { handlers.forEach((f) => f()); window.removeEventListener('hashchange', onHash); };
  }, []);
  return null;
}
