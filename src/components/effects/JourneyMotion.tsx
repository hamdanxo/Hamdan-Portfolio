'use client';

import { useEffect } from 'react';
import { prefersReducedMotion, scrollAnim, type ScrollAnim } from '@/lib/motion';

type Dust = { x: number; y: number; vx: number; vy: number; d: number; r: number; a: number; w: number; blue: boolean };

/** Drives the pinned horizontal timeline: sideways glide with a slow zoom, then a dissolve into rising dust. */
export default function JourneyMotion() {
  useEffect(() => {
    const sec = document.getElementById('journey');
    if (!sec) return;
    const pin = sec.querySelector<HTMLElement>('.jr-pin');
    const stage = sec.querySelector<HTMLElement>('.jr-stage');
    const head = sec.querySelector<HTMLElement>('.jr-head');
    const track = sec.querySelector<HTMLElement>('.jr-track');
    const fill = sec.querySelector<HTMLElement>('.jr-fill');
    const canvas = sec.querySelector<HTMLCanvasElement>('.jr-dust');
    const items = Array.from(sec.querySelectorAll<HTMLElement>('.jr-item'));
    if (!pin || !stage || !head || !track || !fill || !canvas || !items.length) return;
    if (prefersReducedMotion()) { sec.classList.add('jr-static'); items.forEach((it) => it.classList.add('on')); return; }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const n = items.length;
    const A = 0.8; // share of the scroll spent gliding; the rest is the dust
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let vw = 0, vh = 0, S = 0, dpr = 1, lastW = -1;
    let dust: Dust[] | null = null;

    const layout = () => {
      vw = pin.clientWidth; vh = pin.clientHeight;
      // Spacing so the first screen shows only the first two stops.
      S = Math.round(vw < 700 ? vw * 0.46 : Math.min(Math.max(vw * 0.48, 300), 760));
      track.style.setProperty('--s', `${S}px`);
      track.style.width = `${S * n}px`;
      // Scroll length grows with the line, plus room for the dust at the end.
      sec.style.height = `${Math.round(vh + (n - 1) * S * (coarse ? 1.25 : 1.5) + vh * 0.9)}px`;
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5);
      canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr);
      canvas.style.width = `${vw}px`; canvas.style.height = `${vh}px`;
      dust = null;
    };

    // Sample dust from whatever is on screen when the dissolve starts: the line, the dots and the text.
    const makeDust = (): Dust[] => {
      const box = pin.getBoundingClientRect();
      const out: Dust[] = [];
      const total = coarse ? 650 : 1500;
      const rects: DOMRect[] = [];
      sec.querySelectorAll<HTMLElement>('.jr-when, .jr-name, .jr-note, .jr-dot, .jr-title, .jr-label').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > box.left && r.left < box.right && r.bottom > box.top && r.top < box.bottom && r.width > 0) rects.push(r);
      });
      const line = track.querySelector<HTMLElement>('.jr-line')?.getBoundingClientRect();
      const area = rects.reduce((s, r) => s + r.width * r.height, 0) || 1;
      const add = (x: number, y: number, big: boolean) => {
        out.push({
          x: x - box.left, y: y - box.top,
          vx: (Math.random() - 0.5) * 60, vy: -(vh * (0.25 + Math.random() * 0.55)),
          d: Math.min(0.62, Math.max(0, ((x - box.left) / vw + 0.12) / 1.35 - 0.04 + Math.random() * 0.06)),
          r: big ? 1.1 + Math.random() * 1.7 : 0.6 + Math.random() * 1.2,
          a: 0.45 + Math.random() * 0.55, w: Math.random() * 6.28, blue: Math.random() < 0.35,
        });
      };
      const lineCount = Math.round(total * 0.3);
      if (line) for (let k = 0; k < lineCount; k++) add(box.left + Math.random() * vw, line.top + line.height / 2 + (Math.random() - 0.5) * 2, false);
      for (const r of rects) {
        const c = Math.round(((total - lineCount) * r.width * r.height) / area);
        for (let k = 0; k < c; k++) add(r.left + Math.random() * r.width, r.top + Math.random() * r.height, true);
      }
      return out;
    };

    const drawDust = (b: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);
      if (b <= 0 || b >= 1) return;
      if (!dust) dust = makeDust();
      for (const p of dust) {
        const q = Math.min(1, Math.max(0, (b - p.d) / 0.42));
        if (q <= 0 || q >= 1) continue;
        const e = q * q * (3 - 2 * q);
        const x = p.x + p.vx * e + Math.sin(p.w + q * 5) * 10 * q;
        const y = p.y + p.vy * e;
        const a = p.a * Math.min(1, q * 8) * Math.pow(1 - q, 1.3);
        ctx.fillStyle = p.blue ? `rgba(140,190,242,${a.toFixed(3)})` : `rgba(232,238,245,${a.toFixed(3)})`;
        ctx.fillRect(x, y, p.r, p.r);
      }
    };

    // Ease used by the glide (gentle, still tied to the scroll).
    const easeA = (a: number) => a * a * (3 - 2 * a) * 0.35 + a * 0.65;
    const f0 = () => (vw < 700 ? 1.16 : 1); // phones start a touch further along so the second card fits

    // Phones: every moving part is a keyframe animation tied to the scroll position. Where the browser supports
    // scroll-driven animations the graphics chip plays them, so nothing lags behind the finger. The dissolve is a
    // staggered fade (left to right) instead of a moving mask, which phones would have to repaint every frame.
    let anims: ScrollAnim[] = [];
    const build = () => {
      anims.forEach((a) => a.anim.cancel());
      anims = [];
      const off = (b: number) => A + (1 - A) * Math.min(1, Math.max(0, b));
      const K = 40;
      const tf: Keyframe[] = [], ff: Keyframe[] = [];
      for (let k = 0; k <= K; k++) {
        const a = k / K, ea = easeA(a);
        const focus = S * (f0() + ea * (n - 0.5 - f0())), sc = 0.92 + 0.18 * ea;
        tf.push({ offset: a * A, transform: `translate3d(${(vw / 2 - sc * focus).toFixed(1)}px,0,0) scale(${sc.toFixed(4)})` });
        ff.push({ offset: a * A, transform: `scaleX(${(focus / (S * n)).toFixed(4)})` });
      }
      tf.push({ ...tf[K], offset: 1 }); ff.push({ ...ff[K], offset: 1 });
      track.style.transformOrigin = '0 0';
      anims.push(scrollAnim(track, sec, tf), scrollAnim(fill, sec, ff));

      // Where everything sits on screen once the glide has finished.
      const focusE = S * (n - 0.5), scE = 1.1;
      const X = (t: number) => vw / 2 + scE * (t - focusE);
      // A thing spanning u0..u1 (share of the screen width) starts fading as the sweep reaches its left side
      // and is gone once it passes its right side.
      const fade = (el: Element, u0: number, u1: number) => {
        const bS = Math.max(0, u0 / 1.35), bE = Math.max(bS + 0.04, (u1 + 0.12) / 1.35);
        anims.push(scrollAnim(el, sec, [
          { offset: 0, opacity: 1 }, { offset: off(bS), opacity: 1 }, { offset: off(bE), opacity: 0 }, { offset: 1, opacity: 0 },
        ]));
      };
      items.forEach((it, i) => {
        const cw = it.querySelector<HTMLElement>('.jr-card')?.offsetWidth ?? S;
        const x0 = S * (i + 0.5) - 14;
        fade(it, X(x0) / vw, X(x0 + cw) / vw);
      });
      const pb = pin.getBoundingClientRect();
      head.querySelectorAll('.jr-label, .jr-w').forEach((el) => {
        const r = el.getBoundingClientRect();
        fade(el, (r.left - pb.left) / vw, (r.right - pb.left) / vw);
      });
      // The line shrinks from the left so its end follows the sweep.
      const line = track.querySelector<HTMLElement>('.jr-line');
      if (line) {
        const L = X(0), R = X(S * n), lf: Keyframe[] = [{ offset: 0, transform: 'scaleX(1)' }];
        for (let k = 0; k <= 24; k++) {
          const b = k / 24, edge = (b * 1.35 - 0.06) * vw;
          lf.push({ offset: off(b), transform: `scaleX(${Math.min(1, Math.max(0, (R - Math.max(L, edge)) / (R - L))).toFixed(4)})` });
        }
        lf.push({ offset: 1, transform: 'scaleX(0)' });
        line.style.transformOrigin = '100% 50%';
        anims.push(scrollAnim(line, sec, lf));
      }
    };

    let raf = 0, live = false, lastP = -1;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const r = sec.getBoundingClientRect();
      const span = r.height - vh;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(span, 1)));
      if (Math.abs(p - lastP) < 0.0002) return;
      lastP = p;
      const a = Math.min(1, p / A);
      const b = Math.max(0, (p - A) / (1 - A));
      const focus = S * (f0() + easeA(a) * (n - 0.5 - f0()));
      if (coarse) {
        anims.forEach((x) => x.set(p));
        items.forEach((it, i) => it.classList.toggle('on', S * (i + 0.5) <= focus + S * 0.3));
        if (b <= 0) dust = null;
        drawDust(b);
        return;
      }
      const scale = 0.92 + 0.18 * easeA(a);
      track.style.transformOrigin = `${focus.toFixed(1)}px 0`;
      track.style.transform = `translate3d(${(vw / 2 - focus).toFixed(1)}px,0,0) scale(${scale.toFixed(4)})`;
      fill.style.transform = `scaleX(${(focus / (S * n)).toFixed(4)})`;
      items.forEach((it, i) => it.classList.toggle('on', S * (i + 0.5) <= focus + S * 0.3));
      // The dissolve sweeps from left to right; the dust picks up exactly where the text disappears.
      const edge = (b * 1.35 - 0.12) * 100;
      const mask = b > 0 ? `linear-gradient(90deg,transparent ${edge.toFixed(1)}%,#000 ${(edge + 12).toFixed(1)}%)` : 'none';
      stage.style.webkitMaskImage = mask; stage.style.maskImage = mask;
      head.style.webkitMaskImage = mask; head.style.maskImage = mask;
      if (b <= 0) dust = null;
      drawDust(b);
    };
    const start = () => { if (!live) { live = true; lastP = -1; raf = requestAnimationFrame(frame); } };
    const stop = () => { live = false; cancelAnimationFrame(raf); };
    const io = new IntersectionObserver((es) => (es[0].isIntersecting ? start() : stop()), { rootMargin: '200px 0px' });

    const onResize = () => {
      if (coarse && window.innerWidth === lastW) return; // phones: ignore address-bar height changes
      lastW = window.innerWidth;
      layout(); if (coarse) build(); lastP = -1;
    };
    layout(); lastW = window.innerWidth;
    if (coarse) { build(); document.fonts?.ready.then(() => { if (window.innerWidth === lastW) build(); }); }
    io.observe(sec);
    window.addEventListener('resize', onResize);
    return () => { stop(); io.disconnect(); window.removeEventListener('resize', onResize); anims.forEach((x) => x.anim.cancel()); };
  }, []);
  return null;
}
