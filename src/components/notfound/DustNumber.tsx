'use client';

import { useEffect, useRef } from 'react';

/** "404" that crumbles into dust from left to right, then slowly comes back, on a loop. */
export default function DustNumber({ text = '404' }: { text?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, dpr = 1, raf = 0, start = 0, visible = true;
    type Grain = { x: number; y: number; c: string; d: number; vx: number; vy: number; w: number };
    let grains: Grain[] = [];
    let font = '';

    const drawText = (c: CanvasRenderingContext2D) => {
      c.font = font;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      const g = c.createLinearGradient(0, H * 0.15, 0, H * 0.9);
      g.addColorStop(0, '#ff5a63');
      g.addColorStop(1, 'rgba(223,37,49,0.35)');
      c.fillStyle = g;
      c.fillText(text, W / 2, H * 0.54);
    };

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      const fam = getComputedStyle(document.documentElement).getPropertyValue('--font-cormorant').trim() || 'Georgia';
      font = `italic 400 ${Math.min(H * 0.95, W * 0.42)}px ${fam}, Georgia, serif`;
      // sample the text into grains
      const off = document.createElement('canvas');
      off.width = Math.ceil(W); off.height = Math.ceil(H);
      const o = off.getContext('2d', { willReadFrequently: true });
      if (!o) return;
      drawText(o);
      const data = o.getImageData(0, 0, off.width, off.height).data;
      const step = W < 600 ? 2 : 3;
      grains = [];
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          const k = (y * off.width + x) * 4;
          if (data[k + 3] < 90) continue;
          const r = Math.random();
          grains.push({
            x, y, w: step,
            c: `rgba(${data[k]},${data[k + 1]},${data[k + 2]},`,
            d: x / W + (Math.random() - 0.5) * 0.06,
            vx: 60 + r * 160, vy: -(15 + Math.random() * 90),
          });
        }
      }
    };

    // timeline (ms): hold, crumble sweep, gone, fade back in
    const HOLD = 1400, SWEEP = 2200, GONE = 700, BACK = 900, LIFE = 0.35;
    const CYCLE = HOLD + SWEEP + GONE + BACK;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      if (!start) start = now;
      const t = (now - start) % CYCLE;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (t < HOLD) { drawText(ctx); return; }
      if (t >= HOLD + SWEEP + GONE) {
        ctx.globalAlpha = (t - HOLD - SWEEP - GONE) / BACK;
        drawText(ctx);
        ctx.globalAlpha = 1;
        return;
      }
      const p = Math.min(1, (t - HOLD) / SWEEP) * (1 + LIFE + 0.06) - 0.03; // sweep front, in 0..1 of the width
      // the letters still standing: draw them, then cut away everything left of the front
      drawText(ctx);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, Math.max(0, p * W + 2), H);
      ctx.globalCompositeOperation = 'source-over';
      // the dust
      for (const g of grains) {
        const l = (p - g.d) / LIFE;
        if (l <= 0 || l >= 1) continue;
        const e = l * l;
        const a = (1 - l) * (1 - l);
        ctx.fillStyle = `${g.c}${a.toFixed(3)})`;
        ctx.fillRect(g.x + g.vx * e, g.y + g.vy * e + Math.sin(l * 6 + g.x) * 3 * l, g.w * (1 - l * 0.5), g.w * (1 - l * 0.5));
      }
    };

    const init = async () => {
      try { await document.fonts.ready; } catch { /* ignore */ }
      setup();
      if (reduced) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); drawText(ctx); return; }
      raf = requestAnimationFrame(frame);
    };
    void init();

    const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; });
    io.observe(cv);
    let rt = 0;
    const onResize = () => { window.clearTimeout(rt); rt = window.setTimeout(() => { setup(); if (reduced) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); drawText(ctx); } }, 150); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', onResize); window.clearTimeout(rt); };
  }, [text]);

  return <canvas ref={ref} className="nf-dust" aria-hidden="true" />;
}
