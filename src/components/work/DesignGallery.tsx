'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useIdleEffect } from '@/lib/useIdleEffect';
import { designs, type Design } from '@/data/designs';

type Dims = { W: number; H: number; G: number; cols: number; rows: number };

const mod = (a: number, b: number) => ((a % b) + b) % b;
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

function Tile({ d, i, w, h, refCb }: { d: Design; i: number; w: number; h: number; refCb: (el: HTMLDivElement | null) => void }) {
  return (
    <div className="dg-tile" ref={refCb} style={{ width: w, height: h }}>
      <div className="r"><span>{d.client}</span><span>{d.title}</span></div>
      <div className={d.img ? 'dg-art' : `dg-art a${(i % 8) + 1}`}>
        {d.img ? <Image src={d.img} alt={d.title} fill sizes="300px" draggable={false} /> : <em>{d.title}</em>}
      </div>
      <div className="r">
        <span className="dg-tags">{d.tags.map((t) => <i key={t}>{t}</i>)}</span>
        <span>{d.year}</span>
      </div>
    </div>
  );
}

/** Phantom-style endless, curved, draggable gallery with a list view. */
export default function DesignGallery() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [dims, setDims] = useState<Dims | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<(HTMLDivElement | null)[]>([]);
  const pos = useRef({ ox: 0, oy: 0, vx: 0, vy: 0 });
  const real = designs.filter((d) => d.img).length;

  const byYear = useMemo(() => {
    const m = new Map<string, Design[]>();
    for (const d of designs) m.set(d.year, [...(m.get(d.year) ?? []), d]);
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, []);

  // Size the stage edge to edge on large screens and work out how many tiles cover it.
  const measure = useCallback(() => {
    const stage = stageRef.current, wrap = wrapRef.current;
    if (!stage || !wrap) return;
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
    const sw = stage.clientWidth, sh = stage.clientHeight, m = sw < 700;
    const W = m ? 190 : 290, H = m ? 240 : 350, G = m ? 10 : 14;
    setDims({ W, H, G, cols: Math.ceil(sw / (W + G)) + 3, rows: Math.ceil(sh / (H + G)) + 3 });
  }, []);

  const draw = useCallback(() => {
    const stage = stageRef.current;
    if (!stage || !dims) return;
    const { W, H, G, cols, rows } = dims;
    const sw = stage.clientWidth, sh = stage.clientHeight, hw = sw / 2, hh = sh / 2;
    const TW = cols * (W + G), TH = rows * (H + G);
    const { ox, oy } = pos.current;
    tilesRef.current.forEach((el, k) => {
      if (!el) return;
      const c = k % cols, r = Math.floor(k / cols);
      const x = mod(c * (W + G) + ox, TW) - (W + G);
      const y = mod(r * (H + G) + oy, TH) - (H + G);
      const nx = (x + W / 2 - hw) / hw, ny = (y + H / 2 - hh) / hh;
      const z = -(nx * nx * 1.1 + ny * ny * 0.8) * 260;
      el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${(-nx * 24).toFixed(2)}deg) rotateX(${(ny * 16).toFixed(2)}deg)`;
    });
  }, [dims]);

  // Build the grid when the browser is idle, so it never slows down the first load.
  useIdleEffect(() => {
    if (view !== 'grid') return;
    measure();
    let t = 0;
    const onResize = () => { window.clearTimeout(t); t = window.setTimeout(measure, 150); };
    window.addEventListener('resize', onResize);
    window.addEventListener('worktabs:change', measure);
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener('worktabs:change', measure); };
  }, [view, measure]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !dims || view !== 'grid') return;
    draw();
    stage.querySelector('.dg-plane')?.classList.add('ready');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const p = pos.current;
    let down = false, lx = 0, ly = 0, moved = 0, hover = false, visible = true, raf = 0;

    const pd = (e: PointerEvent) => { down = true; moved = 0; lx = e.clientX; ly = e.clientY; p.vx = p.vy = 0; stage.classList.add('drag'); stage.setPointerCapture(e.pointerId); };
    const pm = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      lx = e.clientX; ly = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
      p.ox += dx; p.oy += dy; p.vx = dx; p.vy = dy; draw();
    };
    const up = () => { if (!down) return; down = false; stage.classList.remove('drag'); if (rm) p.vx = p.vy = 0; };
    const click = (e: MouseEvent) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } };
    const enter = () => { hover = true; };
    const leave = () => { hover = false; };
    const wheel = (e: WheelEvent) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); p.ox -= e.deltaX; draw(); } };
    const key = (e: KeyboardEvent) => {
      const s = 60;
      if (e.key === 'ArrowLeft') p.ox += s; else if (e.key === 'ArrowRight') p.ox -= s;
      else if (e.key === 'ArrowUp') p.oy += s; else if (e.key === 'ArrowDown') p.oy -= s; else return;
      e.preventDefault(); draw();
    };
    stage.addEventListener('pointerdown', pd);
    stage.addEventListener('pointermove', pm);
    stage.addEventListener('pointerup', up);
    stage.addEventListener('pointercancel', up);
    stage.addEventListener('click', click, true);
    stage.addEventListener('pointerenter', enter);
    stage.addEventListener('pointerleave', leave);
    stage.addEventListener('wheel', wheel, { passive: false });
    stage.addEventListener('keydown', key);

    const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { rootMargin: '100px' });
    io.observe(stage);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || down) return;
      if (Math.abs(p.vx) > 0.05 || Math.abs(p.vy) > 0.05) { p.ox += p.vx; p.oy += p.vy; p.vx *= 0.94; p.vy *= 0.94; draw(); }
      else if (!rm && !hover) { p.ox -= 0.25; p.oy -= 0.12; draw(); }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      stage.removeEventListener('pointerdown', pd); stage.removeEventListener('pointermove', pm);
      stage.removeEventListener('pointerup', up); stage.removeEventListener('pointercancel', up);
      stage.removeEventListener('click', click, true); stage.removeEventListener('pointerenter', enter);
      stage.removeEventListener('pointerleave', leave); stage.removeEventListener('wheel', wheel);
      stage.removeEventListener('keydown', key);
    };
  }, [dims, draw, view]);

  const count = dims ? dims.cols * dims.rows : 0;

  return (
    <div className="cat-list">
      <div className="dg" ref={wrapRef}>
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
          <span className="dg-count">All designs <b>{pad(real)}</b></span>
          <span className="dg-hint" style={{ visibility: view === 'grid' ? 'visible' : 'hidden' }}><i aria-hidden="true" />Drag to explore</span>
        </div>

        <div className="dg-stage" ref={stageRef} hidden={view !== 'grid'} tabIndex={0} role="region" aria-label="Design gallery. Drag or use the arrow keys to move around." data-lenis-prevent="">
          <div className="dg-plane">
            {Array.from({ length: count }, (_, k) => {
              const cols = dims?.cols ?? 1;
              const i = ((k % cols) + Math.floor(k / cols) * 3) % designs.length;
              return <Tile key={k} d={designs[i]} i={i} w={dims?.W ?? 0} h={dims?.H ?? 0} refCb={(el) => { tilesRef.current[k] = el; }} />;
            })}
          </div>
          <div className="dg-vig" aria-hidden="true" />
        </div>

        {view === 'list' && (
          <div className="dg-list">
            {byYear.map(([year, items]) => (
              <div className="dg-yr" key={year}>
                <span>{year}</span>
                <div>
                  {items.map((d) => (
                    <div className="dg-row" key={d.title}>
                      <b>{d.title}</b>
                      <span className="dg-tags">{d.tags.map((t) => <i key={t}>{t}</i>)}</span>
                      <small>{d.client}</small>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
