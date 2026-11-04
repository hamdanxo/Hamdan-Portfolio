'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Book, Design } from '@/data/designs';
import type { PageFlip } from 'page-flip/dist/js/page-flip.module.js';

const PRELOAD = 6;

/** Page-turning book (StPageFlip). Pages are built outside React so the library can own them. */
function BookFlip({ book, title, onPage }: { book: Book; title: string; onPage: (index: number, spread: boolean) => void }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    const root = document.createElement('div');
    root.className = 'bk-root';
    host.appendChild(root);

    // Build pages; only the first few images load now, the rest load as you turn.
    const imgs: HTMLImageElement[] = [];
    book.pages.forEach((src, i) => {
      const page = document.createElement('div');
      page.className = 'bk-page';
      // Covers are stiff board: the front and back covers and the inside of each.
      const n = book.pages.length;
      if (i <= 1 || i >= n - 2) page.dataset.density = 'hard';
      const img = document.createElement('img');
      img.alt = `${title}, page ${i + 1}`;
      img.decoding = 'async';
      img.draggable = false;
      img.dataset.src = src;
      if (i < PRELOAD) img.src = src;
      page.appendChild(img);
      root.appendChild(page);
      imgs.push(img);
    });
    const loadAround = (i: number) => {
      for (let k = Math.max(0, i - 2); k < Math.min(imgs.length, i + PRELOAD); k++) {
        const im = imgs[k];
        if (!im.getAttribute('src') && im.dataset.src) im.src = im.dataset.src;
      }
    };

    (async () => {
      const { PageFlip } = await import('page-flip/dist/js/page-flip.module.js');
      if (cancelled) return;
      // Fit the book to the screen: an open spread on wide screens, one page at a time on phones.
      const portrait = window.innerWidth < 760 || window.innerWidth / window.innerHeight < 0.95;
      const ratio = book.width / book.height;
      const availW = host.clientWidth, availH = host.clientHeight;
      let h = availH, w = h * ratio;
      const perRow = portrait ? 1 : 2;
      if (w * perRow > availW) { w = availW / perRow; h = w / ratio; }
      root.style.width = `${Math.floor(w * perRow)}px`;
      const pf = new PageFlip(root, {
        width: Math.floor(w),
        height: Math.floor(h),
        size: 'fixed',
        showCover: true,
        usePortrait: portrait,
        drawShadow: true,
        maxShadowOpacity: 0.45,
        flippingTime: 900,
        mobileScrollSupport: false,
        swipeDistance: 20,
        showPageCorners: true,
      });
      pf.loadFromHTML(root.querySelectorAll<HTMLElement>('.bk-page'));
      // A closed book sits on one half of the spread; slide it to the middle while closed.
      const place = (i: number) => {
        const spread = pf.getOrientation() === 'landscape';
        root.dataset.at = !spread ? '' : i === 0 ? 'front' : i >= book.pages.length - 1 ? 'back' : '';
        onPage(i, spread);
      };
      pf.on('flip', (e) => { loadAround(e.data); place(e.data); });
      pf.on('changeState', (e) => {
        // Once a page is turning, slide back to the middle; if it settles without turning, re-centre.
        if (e.data === 'flipping') root.dataset.at = '';
        else if (e.data === 'read') place(pf.getCurrentPageIndex());
      });
      flipRef.current = pf;
      place(0);
      root.classList.add('ready');
    })();

    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') flipRef.current?.flipNext();
      else if (e.key === 'ArrowLeft') flipRef.current?.flipPrev();
    };
    window.addEventListener('keydown', key);

    return () => {
      cancelled = true;
      window.removeEventListener('keydown', key);
      try { flipRef.current?.destroy(); } catch { /* already gone */ }
      flipRef.current = null;
      root.remove();
    };
  }, [book, title, onPage]);

  return (
    <>
      <div className="bk-host" ref={hostRef} />
      <div className="bk-controls">
        <button type="button" className="bk-btn" aria-label="Previous page" onClick={() => flipRef.current?.flipPrev()}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <span className="bk-hint"><span className="bk-fine">Drag a corner or use the arrow keys</span><span className="bk-touch">Swipe or tap the page edges</span></span>
        <button type="button" className="bk-btn" aria-label="Next page" onClick={() => flipRef.current?.flipNext()}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
    </>
  );
}

/** Full-screen viewer: books open as a page-turning spread, single designs as a large image. */
export default function DesignViewer({ design, onClose }: { design: Design | null; onClose: () => void }) {
  const [page, setPage] = useState<{ i: number; spread: boolean }>({ i: 0, spread: false });
  const closeRef = useRef<HTMLButtonElement>(null);
  const onPage = useCallback((i: number, spread: boolean) => setPage({ i, spread }), []);

  useEffect(() => {
    if (!design) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    window.__lenis?.stop();
    html.style.overflow = 'hidden';
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('keydown', esc);
      html.style.overflow = prevOverflow;
      window.__lenis?.start();
      prevFocus?.focus?.();
    };
  }, [design, onClose]);

  if (!design || typeof document === 'undefined') return null;
  const total = design.book?.pages.length ?? 1;
  const label = (() => {
    if (!design.book) return null;
    const { i, spread } = page;
    if (!spread || i === 0 || i >= total - 1) return `${i + 1} / ${total}`;
    return `${i + 1}-${Math.min(i + 2, total)} / ${total}`;
  })();

  return createPortal(
    <div className="dv" role="dialog" aria-modal="true" aria-label={`${design.client}, ${design.title}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dv-top">
        <div className="dv-title">
          <span className="dv-client">{design.client} · {design.year}</span>
          <h2>{design.title}</h2>
        </div>
        <div className="dv-right">
          {label && <span className="dv-count" aria-live="polite">{label}</span>}
          <button ref={closeRef} type="button" className="dv-close" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
      </div>
      <div className="dv-body" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        {design.book ? (
          <BookFlip book={design.book} title={design.title} onPage={onPage} />
        ) : design.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="dv-img" src={design.img} alt={design.title} />
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
