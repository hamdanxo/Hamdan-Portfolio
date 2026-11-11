'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useIdleEffect } from '@/lib/useIdleEffect';
import { webglInfo } from '@/lib/motion';
import { designs, work, type Design } from '@/data/designs';
import DesignViewer from './DesignViewer';
import type { GalleryGL } from './gallery/glGallery';
import type { TileSize } from './gallery/atlas';

type Dims = TileSize & { cols: number; rows: number };

const mod = (a: number, b: number) => ((a % b) + b) % b;
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const tileSize = (stageWidth: number): TileSize =>
  stageWidth < 700 ? { W: 190, H: 240, G: 10 } : { W: 290, H: 350, G: 14 };

/** DOM tile, only used when WebGL is not available. */
function Tile({ d, i, w, h, refCb }: { d: Design; i: number; w: number; h: number; refCb: (el: HTMLDivElement | null) => void }) {
  return (
    <div className={d.img ? 'dg-tile dg-real' : 'dg-tile'} data-i={i} ref={refCb} style={{ width: w, height: h }}>
      <div className="r"><span>{d.client}</span><span>{d.title}</span></div>
      <div className={d.img ? (d.book && d.book.width > d.book.height ? 'dg-art dg-wide' : 'dg-art') : `dg-art a${(i % 8) + 1}`}>
        {d.img ? <Image src={d.img} alt={d.title} fill sizes="300px" draggable={false} /> : <em>{d.title}</em>}
      </div>
      <div className="r">
        <span className="dg-tags">{d.tags.map((t) => <i key={t}>{t}</i>)}</span>
        <span>{d.year}</span>
      </div>
    </div>
  );
}

/**
 * Phantom-style endless, curved, draggable gallery with a list view.
 * Drawn with WebGL (Three.js) so it stays smooth on phones; falls back to DOM tiles without WebGL.
 */
export default function DesignGallery({ fullscreen = false }: { fullscreen?: boolean }) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mode, setMode] = useState<'pending' | 'gl' | 'dom'>('pending');
  const [dims, setDims] = useState<Dims | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<GalleryGL | null>(null);
  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);
  const pos = useRef({ ox: 0, oy: 0, vx: 0, vy: 0 });
  const [open, setOpen] = useState<Design | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const byYear = useMemo(() => {
    const m = new Map<string, Design[]>();
    for (const d of work) m.set(d.year, [...(m.get(d.year) ?? []), d]);
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, []);

  /** Edge to edge on large screens (always, in full-screen mode). */
  const bleed = useCallback(() => {
    const stage = stageRef.current, wrap = wrapRef.current;
    if (!stage || !wrap) return;
    if (fullscreen) return; // handled in CSS (.dg-full), so nothing shifts after load
    const vw = document.documentElement.clientWidth;
    if (vw > 900) {
      stage.classList.add('bleed');
      stage.style.width = `${vw}px`;
      stage.style.marginLeft = `${-wrap.getBoundingClientRect().left}px`;
    } else {
      stage.classList.remove('bleed');
      stage.style.width = '';
      stage.style.marginLeft = '';
    }
  }, [fullscreen]);

  // ---------- set up the renderer (WebGL first, DOM tiles as fallback) ----------
  useIdleEffect(() => {
    if (view !== 'grid') return;
    let cancelled = false;
    const stage = stageRef.current, canvas = canvasRef.current;
    if (!stage || !canvas) return;
    bleed();

    const setupDom = () => {
      const sw = stage.clientWidth, sh = stage.clientHeight, t = tileSize(sw);
      setDims({ ...t, cols: Math.ceil(sw / (t.W + t.G)) + 6, rows: Math.ceil(sh / (t.H + t.G)) + 6 });
      setMode('dom');
    };

    (async () => {
      // No GPU (WebGL missing or software-rendered): use the lighter DOM grid instead.
      const info = webglInfo();
      if (!info.ok || info.software) { setupDom(); return; }
      try {
        const [{ buildAtlas, loadImages }, { createGalleryGL }] = await Promise.all([
          import('./gallery/atlas'),
          import('./gallery/glGallery'),
        ]);
        await document.fonts?.ready;
        const images = await loadImages(designs);
        if (cancelled) return;
        const size = tileSize(stage.clientWidth);
        const atlas = await buildAtlas(designs, images, size, Math.min(window.devicePixelRatio || 1, 2));
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 0));
        glRef.current = createGalleryGL(canvas, atlas, designs.length, size);
        setMode('gl');
      } catch {
        if (!cancelled) setupDom();
      }
    })();

    let t = 0, lastW = window.innerWidth;
    const onResize = () => {
      // Phones resize the window while scrolling (the address bar hides and shows). Only rebuild when the width changes.
      if (window.matchMedia('(pointer: coarse)').matches && window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        bleed();
        const gl = glRef.current;
        if (gl) { gl.resize(); gl.render(); } else if (stageRef.current) setupDom();
      }, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
      glRef.current?.dispose();
      glRef.current = null;
    };
  }, [view, bleed]);

  // ---------- draw one frame at the current offset ----------
  const draw = useCallback(() => {
    const { ox, oy } = pos.current;
    const gl = glRef.current;
    if (gl) { gl.setOffset(ox, oy); gl.render(); return; }
    const stage = stageRef.current;
    if (!stage || !dims) return;
    const { W, H, G, cols, rows } = dims;
    const sw = stage.clientWidth, sh = stage.clientHeight, hw = sw / 2, hh = sh / 2;
    const TW = cols * (W + G), TH = rows * (H + G);
    tilesRef.current.forEach((el, k) => {
      if (!el) return;
      const c = k % cols, r = Math.floor(k / cols);
      const x = mod(c * (W + G) + ox, TW) - (TW - sw) / 2;
      const y = mod(r * (H + G) + oy, TH) - (TH - sh) / 2;
      const nx = (x + W / 2 - hw) / hw, ny = (y + H / 2 - hh) / hh;
      const z = -(nx * nx * 1.1 + ny * ny * 0.8) * 260;
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${(-nx * 24).toFixed(2)}deg) rotateX(${(ny * 16).toFixed(2)}deg)`;
    });
  }, [dims]);

  // ---------- drag, glide, drift, keys ----------
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || view !== 'grid' || mode === 'pending' || (mode === 'dom' && !dims)) return;
    draw();
    stage.querySelector('.dg-plane')?.classList.add('ready');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const p = pos.current;
    let down = false, lx = 0, ly = 0, moved = 0, visible = true, raf = 0, dirty = true;
    // Without a GPU (software WebGL) the idle drift is skipped; the grid still moves when dragged.
    const software = glRef.current ? glRef.current.software : webglInfo().software;

    const pd = (e: PointerEvent) => { down = true; moved = 0; lx = e.clientX; ly = e.clientY; p.vx = p.vy = 0; stage.classList.add('drag'); stage.setPointerCapture(e.pointerId); };
    const pm = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && glRef.current) {
        const r = stage.getBoundingClientRect();
        glRef.current.setMouse(e.clientX - r.left, e.clientY - r.top);
        if (!down) {
          const i = glRef.current.pick(e.clientX - r.left, e.clientY - r.top);
          stage.classList.toggle('dg-pick', i >= 0 && !!designs[i].img);
          glRef.current.hover(i);
        }
        dirty = true;
      }
      if (!down) return;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      lx = e.clientX; ly = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
      p.ox += dx; p.oy += dy; p.vx = dx; p.vy = dy; dirty = true;
    };
    const up = () => { if (!down) return; down = false; stage.classList.remove('drag'); if (rm) p.vx = p.vy = 0; };
    const leave = () => { glRef.current?.setMouse(null, null); glRef.current?.hover(-1); stage.classList.remove('dg-pick'); dirty = true; };
    const click = (e: MouseEvent) => {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); return; }
      const gl = glRef.current;
      let i = -1;
      if (gl) {
        const r = stage.getBoundingClientRect();
        i = gl.pick(e.clientX - r.left, e.clientY - r.top);
      } else {
        // The stage captures the pointer, so look up which DOM tile is under it.
        const tile = document.elementsFromPoint(e.clientX, e.clientY).find((el) => el instanceof HTMLElement && el.dataset.i !== undefined) as HTMLElement | undefined;
        if (tile) i = Number(tile.dataset.i);
      }
      if (i >= 0 && designs[i].img) { p.vx = p.vy = 0; setOpen(designs[i]); }
    };
    const wheel = (e: WheelEvent) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); p.ox -= e.deltaX; dirty = true; } };
    const key = (e: KeyboardEvent) => {
      const s = 60;
      if (e.key === 'ArrowLeft') p.ox += s; else if (e.key === 'ArrowRight') p.ox -= s;
      else if (e.key === 'ArrowUp') p.oy += s; else if (e.key === 'ArrowDown') p.oy -= s; else return;
      e.preventDefault();
      dirty = true;
    };
    // Enter on the focused gallery opens the first real design (keyboard users also have the list view).
    const enter = (e: KeyboardEvent) => { if (e.key === 'Enter' && e.target === stage && work[0]) setOpen(work[0]); };
    stage.addEventListener('keydown', enter);
    stage.addEventListener('pointerdown', pd);
    stage.addEventListener('pointermove', pm);
    stage.addEventListener('pointerup', up);
    stage.addEventListener('pointercancel', up);
    stage.addEventListener('pointerleave', leave);
    stage.addEventListener('click', click, true);
    stage.addEventListener('wheel', wheel, { passive: false });
    stage.addEventListener('keydown', key);

    // While the page itself is scrolling, hold the idle drift so scrolling stays smooth (mostly matters on phones).
    let scrollingUntil = 0;
    const onPageScroll = () => { scrollingUntil = performance.now() + 220; };
    window.addEventListener('scroll', onPageScroll, { passive: true });
    const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { rootMargin: '100px' });
    io.observe(stage);

    // One frame loop: pointer moves only update numbers; drawing happens once per frame.
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(3, (now - last) / 16.667);
      last = now;
      if (!visible || document.hidden) return;
      if (!down && now < scrollingUntil && Math.abs(p.vx) < 0.05 && Math.abs(p.vy) < 0.05) { if (dirty) { dirty = false; draw(); } return; }
      if (!down) {
        if (Math.abs(p.vx) > 0.05 || Math.abs(p.vy) > 0.05) {
          p.ox += p.vx * dt; p.oy += p.vy * dt;
          const f = Math.pow(0.94, dt);
          p.vx *= f; p.vy *= f;
        } else if (!rm && !software) {
          p.ox -= 0.25 * dt; p.oy -= 0.12 * dt;
        } else if (!dirty) {
          return; // nothing moved: skip drawing
        }
      }
      dirty = false;
      draw();
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('scroll', onPageScroll);
      stage.removeEventListener('pointerdown', pd); stage.removeEventListener('pointermove', pm);
      stage.removeEventListener('pointerup', up); stage.removeEventListener('pointercancel', up);
      stage.removeEventListener('pointerleave', leave);
      stage.removeEventListener('click', click, true); stage.removeEventListener('wheel', wheel);
      stage.removeEventListener('keydown', key);
      stage.removeEventListener('keydown', enter);
    };
  }, [dims, draw, view, mode]);

  const count = mode === 'dom' && dims ? dims.cols * dims.rows : 0;

  return (
    <div className="cat-list">
      <div className={fullscreen ? 'dg dg-full' : 'dg'} ref={wrapRef}>
        <div className="dg-bar">
          <div className="dg-views" role="group" aria-label="View">
            {(['grid', 'list'] as const).map((v) => (
              <button key={v} type="button" className={view === v ? 'on' : undefined} aria-pressed={view === v} aria-label={v === 'grid' ? 'Grid view' : 'List view'} onClick={() => setView(v)}>
                {v === 'grid' ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14" /></svg>
                )}
              </button>
            ))}
          </div>
          <span className="dg-count">All designs <b>{pad(work.length)}</b></span>
          <span className="dg-hint" style={{ visibility: view === 'grid' ? 'visible' : 'hidden' }}><i aria-hidden="true" />Drag to explore</span>
        </div>

        {view === 'grid' && (
          <div className={`dg-stage dg-${mode}`} ref={stageRef} tabIndex={0} role="region" aria-label="Design gallery. Drag or use the arrow keys to move around." data-lenis-prevent="">
            <canvas ref={canvasRef} className="dg-canvas" aria-hidden="true" />
            {mode === 'dom' && (
              <div className="dg-plane">
                {Array.from({ length: count }, (_, k) => {
                  const cols = dims?.cols ?? 1;
                  const i = ((k % cols) + Math.floor(k / cols) * 3) % designs.length;
                  return <Tile key={k} d={designs[i]} i={i} w={dims?.W ?? 0} h={dims?.H ?? 0} refCb={(el) => { tilesRef.current[k] = el; }} />;
                })}
              </div>
            )}
            <div className="dg-vig" aria-hidden="true" />
            <ul className="sr-only">
              {work.map((d) => (
                <li key={d.title}><button type="button" onClick={() => setOpen(d)}>Open {d.title}, {d.client}, {d.year}</button></li>
              ))}
            </ul>
          </div>
        )}

        {view === 'list' && (
          <div className="dg-list">
            {byYear.map(([year, items]) => (
              <div className="dg-yr" key={year}>
                <span>{year}</span>
                <div>
                  {items.map((d) => (
                    <button type="button" className="dg-row" data-cursor="view" key={d.title} onClick={() => setOpen(d)}>
                      <b>{d.title}</b>
                      <span className="dg-tags">{d.tags.map((t) => <i key={t}>{t}</i>)}</span>
                      <small>{d.client}</small>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <DesignViewer design={open} onClose={close} />
    </div>
  );
}
