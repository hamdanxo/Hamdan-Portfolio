'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Book, Design, ImageSet } from '@/data/designs';
import type { PageFlip } from 'page-flip/dist/js/page-flip.module.js';

const PRELOAD = 6;

/** Page-turning book (StPageFlip). Pages are built outside React so the library can own them. */
function BookFlip({ book, title, onLabel }: { book: Book; title: string; onLabel: (label: string) => void }) {
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
        const n = book.pages.length;
        root.dataset.at = !spread ? '' : i === 0 ? 'front' : i >= n - 1 ? 'back' : '';
        onLabel(!spread || i === 0 || i >= n - 1 ? `${i + 1} / ${n}` : `${i + 1}-${Math.min(i + 2, n)} / ${n}`);
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
  }, [book, title, onLabel]);

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

/** Where a card sits in the fan, by its distance from the front card. */
function fanStyle(d: number, w: number, spread: boolean, open: boolean): React.CSSProperties {
  const a = Math.abs(d), sign = Math.sign(d);
  if (!open) return { transform: `translate3d(0,0,0) scale(${d === 0 ? 0.9 : 0.86})`, opacity: d === 0 ? 0 : 0, zIndex: 20 - a };
  if (!spread || d === 0) {
    // Before spreading out, every card hides directly behind the front one.
    return { transform: `translate3d(0,0,0) scale(${d === 0 ? 1 : 0.94})`, opacity: d === 0 || a <= 3 ? 1 : 0, zIndex: 20 - a };
  }
  const x = sign * w * (0.5 + 0.27 * (a - 1));
  const scale = Math.max(0.5, 1 - 0.15 * a);
  return {
    transform: `translate3d(${x.toFixed(1)}px,0,0) scale(${scale.toFixed(3)}) rotate(${(sign * Math.min(a, 3) * 1.6).toFixed(2)}deg)`,
    opacity: a > 3 ? 0 : 1,
    zIndex: 20 - a,
    transitionDelay: `${(a - 1) * 70}ms`,
  };
}

/** A series of posts: the front image opens first, then the rest slide out from behind it. */
function SetView({ set, title, onLabel }: { set: ImageSet; title: string; onLabel: (label: string) => void }) {
  const n = set.images.length;
  const [active, setActive] = useState(0);
  const [stage, setStage] = useState<'closed' | 'open' | 'spread'>('closed');
  const [w, setW] = useState(0);
  const hostRef = useRef<HTMLDivElement>(null);

  // Card size: as big as fits, leaving room for the cards peeking at the sides.
  useEffect(() => {
    const fit = () => {
      const host = hostRef.current;
      if (!host) return;
      const ratio = set.width / set.height;
      const byH = host.clientHeight * 0.94 * ratio;
      const byW = host.clientWidth * (host.clientWidth < 700 ? 0.74 : 0.46);
      setW(Math.floor(Math.min(byH, byW)));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [set]);

  // Open the front card, then fan the others out.
  useEffect(() => {
    const a = requestAnimationFrame(() => setStage('open'));
    const t = window.setTimeout(() => setStage('spread'), 420);
    return () => { cancelAnimationFrame(a); window.clearTimeout(t); };
  }, []);

  useEffect(() => { onLabel(`${active + 1} / ${n}`); }, [active, n, onLabel]);

  const go = useCallback((step: number) => setActive((i) => (i + step + n) % n), [n]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [go]);

  // Swipe on phones.
  const start = useRef<{ x: number; y: number } | null>(null);
  const onDown = (e: React.PointerEvent) => { start.current = { x: e.clientX, y: e.clientY }; };
  const onUp = (e: React.PointerEvent) => {
    const s0 = start.current; start.current = null;
    if (!s0) return;
    const dx = e.clientX - s0.x, dy = e.clientY - s0.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  const h = w * (set.height / set.width);
  return (
    <>
      <div className="st-host" ref={hostRef} onPointerDown={onDown} onPointerUp={onUp}>
        {w > 0 && set.images.map((src, i) => {
          // Shortest way round, so the fan is balanced on both sides.
          let d = i - active;
          if (d > n / 2) d -= n; else if (d < -n / 2) d += n;
          return (
            <button
              key={src}
              type="button"
              className={d === 0 ? 'st-card on' : 'st-card'}
              style={{ width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, ...fanStyle(d, w, stage === 'spread', stage !== 'closed') }}
              aria-label={d === 0 ? `${title}, image ${i + 1} of ${n}` : `Show image ${i + 1} of ${n}`}
              aria-current={d === 0 ? 'true' : undefined}
              tabIndex={Math.abs(d) > 3 ? -1 : 0}
              onClick={() => { if (d !== 0) setActive(i); }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" draggable={false} decoding="async" fetchPriority={i === 0 ? 'high' : 'auto'} />
              <span className="st-dim" style={{ opacity: Math.min(0.62, Math.abs(d) * 0.22) }} aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <div className="bk-controls">
        <button type="button" className="bk-btn" aria-label="Previous image" onClick={() => go(-1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <span className="bk-hint"><span className="bk-fine">Click a card or use the arrow keys</span><span className="bk-touch">Swipe or tap a card</span></span>
        <button type="button" className="bk-btn" aria-label="Next image" onClick={() => go(1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
    </>
  );
}

/** Full-screen viewer: books turn like pages, sets fan out as a stack, single designs show large. */
export default function DesignViewer({ design, onClose }: { design: Design | null; onClose: () => void }) {
  const [label, setLabel] = useState('');
  const closeRef = useRef<HTMLButtonElement>(null);
  const onLabel = useCallback((l: string) => setLabel(l), []);

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

  return createPortal(
    <div className="dv" role="dialog" aria-modal="true" aria-label={`${design.client}, ${design.title}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dv-top">
        <div className="dv-title">
          <span className="dv-client">{design.client} · {design.year}</span>
          <h2>{design.title}</h2>
        </div>
        <div className="dv-right">
          {(design.book || design.set) && label && <span className="dv-count" aria-live="polite">{label}</span>}
          <button ref={closeRef} type="button" className="dv-close" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
      </div>
      <div className="dv-body" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        {design.book ? (
          <BookFlip key={design.title} book={design.book} title={design.title} onLabel={onLabel} />
        ) : design.set ? (
          <SetView key={design.title} set={design.set} title={design.title} onLabel={onLabel} />
        ) : design.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="dv-img" src={design.img} alt={design.title} />
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
