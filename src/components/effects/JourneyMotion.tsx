'use client';

import { useEffect } from 'react';
import { prefersReducedMotion, scrollAnim, type ScrollAnim } from '@/lib/motion';

/**
 * Drives the pinned horizontal timeline: a sideways glide with a slow zoom, then the letters turn to dust.
 *
 * The dust is built from the real letters: when the dissolve starts, the visible text, the line and the dots
 * are drawn into a hidden canvas and every lit pixel becomes a grain. The page text is then hidden and the
 * canvas shows the same picture, so a sweep from left to right can lift the grains off one by one, exactly
 * where each letter was, and blow them away.
 */
type Grain = { x: number; y: number; r: number; g: number; b: number; a: number; d: number; vx: number; vy: number; w: number; s: number; c: string };
type Snap = { img: HTMLCanvasElement; live: HTMLCanvasElement; lc: CanvasRenderingContext2D; grains: Grain[]; spread: number; lastB: number };

const SWEEP = 0.62;   // share of the dissolve the sweep takes to cross the screen
const JITTER = 0.07;  // how ragged the breaking edge is
const LIFE = 0.34;    // how long each grain takes to blow away

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
    let snap: Snap | null = null;

    const layout = () => {
      vw = pin.clientWidth; vh = pin.clientHeight;
      S = Math.round(vw < 700 ? vw * 0.46 : Math.min(Math.max(vw * 0.48, 300), 760));
      track.style.setProperty('--s', `${S}px`);
      track.style.width = `${S * n}px`;
      sec.style.height = `${Math.round(vh + (n - 1) * S * (coarse ? 1.25 : 1.5) + vh * 0.9)}px`;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr);
      canvas.style.width = `${vw}px`; canvas.style.height = `${vh}px`;
      snap = null;
    };

    /** Draws what is on screen (text, line, dots) into a canvas, then turns its lit pixels into grains. */
    const takeSnap = (): Snap => {
      const box = pin.getBoundingClientRect();
      const img = document.createElement('canvas');
      img.width = canvas.width; img.height = canvas.height;
      const c = img.getContext('2d', { willReadFrequently: true })!;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const inView = (r: DOMRect) => r.right > box.left && r.left < box.right && r.bottom > box.top && r.top < box.bottom && r.width > 0;

      // the line and its red fill
      const lr = track.querySelector<HTMLElement>('.jr-line')?.getBoundingClientRect();
      const fr = fill.getBoundingClientRect();
      if (lr) {
        c.fillStyle = 'rgba(238,241,243,.14)';
        c.fillRect(lr.left - box.left, lr.top - box.top, lr.width, Math.max(1.5, lr.height));
        const g = c.createLinearGradient(fr.left - box.left, 0, fr.right - box.left, 0);
        g.addColorStop(0, 'rgba(223,37,49,0)'); g.addColorStop(0.3, 'rgba(223,37,49,.6)'); g.addColorStop(0.75, '#df2531'); g.addColorStop(1, '#ffd0d3');
        c.fillStyle = g;
        c.fillRect(fr.left - box.left, fr.top - box.top, fr.width, Math.max(2, fr.height));
      }
      // the dots
      sec.querySelectorAll<HTMLElement>('.jr-dot').forEach((d) => {
        const r = d.getBoundingClientRect();
        if (!inView(r)) return;
        const cx = r.left - box.left + r.width / 2, cy = r.top - box.top + r.height / 2;
        const g = c.createRadialGradient(cx, cy, 0, cx, cy, r.width * 1.8);
        g.addColorStop(0, 'rgba(223,37,49,.55)'); g.addColorStop(1, 'rgba(223,37,49,0)');
        c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r.width * 1.8, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#df2531'; c.beginPath(); c.arc(cx, cy, r.width / 2, 0, Math.PI * 2); c.fill();
      });
      // the words, drawn word by word in their real font, colour and position
      sec.querySelectorAll<HTMLElement>('.jr-label, .jr-title, .jr-when, .jr-name, .jr-note').forEach((el) => {
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || Number(cs.opacity) < 0.05) return;
        c.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        c.fillStyle = cs.color;
        c.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
        c.textBaseline = 'alphabetic';
        const upper = cs.textTransform === 'uppercase';
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let t = walker.nextNode() as Text | null; t; t = walker.nextNode() as Text | null) {
          const s = t.data;
          const re = /\S+/g;
          for (let m = re.exec(s); m; m = re.exec(s)) {
            const range = document.createRange();
            range.setStart(t, m.index); range.setEnd(t, m.index + m[0].length);
            const r = range.getBoundingClientRect();
            if (!inView(r)) continue;
            const word = upper ? m[0].toUpperCase() : m[0];
            const mt = c.measureText(word);
            const sc = mt.width > 0 ? r.width / mt.width : 1; // the track is zoomed, so match the drawn size
            const asc = mt.fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.8;
            const desc = mt.fontBoundingBoxDescent || parseFloat(cs.fontSize) * 0.2;
            const base = r.top - box.top + (r.height - (asc + desc) * sc) / 2 + asc * sc;
            c.save();
            c.translate(r.left - box.left, base);
            c.scale(sc, sc);
            c.fillText(word, 0, 0);
            c.restore();
          }
        }
      });

      // every lit pixel (on a small grid) becomes a grain
      const data = c.getImageData(0, 0, img.width, img.height).data;
      const max = coarse ? 3200 : 11000;
      let lit = 0;
      for (let i = 3; i < data.length; i += 4 * 3) if (data[i] > 60) lit++;
      const stepCss = Math.max(1.2, Math.sqrt((lit * 3) / max) / dpr * 1.05);
      const step = Math.max(1, Math.round(stepCss * dpr));
      const grains: Grain[] = [];
      for (let py = 0; py < img.height; py += step) {
        for (let px = 0; px < img.width; px += step) {
          const k = (py * img.width + px) * 4;
          const a = data[k + 3];
          if (a < 60) continue;
          const x = px / dpr, y = py / dpr;
          grains.push({
            x, y, r: data[k], g: data[k + 1], b: data[k + 2], a: a / 255,
            d: (x / vw) * SWEEP + Math.random() * JITTER,
            vx: 30 + Math.random() * 110,
            vy: -(vh * (0.08 + Math.random() * 0.3)),
            w: Math.random() * 6.28,
            // a slightly ashen version of the letter's colour, worked out once instead of every frame
            c: `rgb(${Math.round(data[k] * 0.8 + 30)},${Math.round(data[k + 1] * 0.8 + 24)},${Math.round(data[k + 2] * 0.8 + 24)})`,
            s: (step / dpr) * (0.8 + Math.random() * 0.6),
          });
        }
      }
      grains.sort((p, q) => p.d - q.d);
      const live = document.createElement('canvas');
      live.width = img.width; live.height = img.height;
      const lc = live.getContext('2d')!;
      lc.drawImage(img, 0, 0);
      return { img, live, lc, grains, spread: step / dpr, lastB: 0 };
    };

    const drawDust = (b: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (b <= 0) return;
      if (!snap) snap = takeSnap();
      const sn = snap;
      // The picture of the text loses a tiny square for every grain that has lifted off, so the letters
      // crumble exactly where the grains came from. Scrolling back up puts the picture back together.
      const sp = Math.ceil(sn.spread * dpr) + 1;
      if (b < sn.lastB) { sn.lc.globalCompositeOperation = 'source-over'; sn.lc.clearRect(0, 0, sn.live.width, sn.live.height); sn.lc.drawImage(sn.img, 0, 0); sn.lastB = 0; }
      sn.lc.globalCompositeOperation = 'destination-out';
      for (const p of sn.grains) {
        if (p.d > b) break;
        if (p.d <= sn.lastB) continue;
        sn.lc.fillRect(Math.floor(p.x * dpr), Math.floor(p.y * dpr), sp, sp);
      }
      sn.lc.globalCompositeOperation = 'source-over';
      // Behind the ragged edge everything has gone, faint edge pixels included.
      const done = ((b - JITTER) / SWEEP) * vw;
      if (done > 0) sn.lc.clearRect(0, 0, Math.ceil(done * dpr), sn.live.height);
      sn.lastB = b;
      ctx.drawImage(sn.live, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const p of sn.grains) {
        if (p.d > b) { break; }
        const q = (b - p.d) / LIFE;
        if (q >= 1) continue;
        const e = q * q;                      // starts slow, picks up speed like it is caught by wind
        const x = p.x + p.vx * e + Math.sin(p.w + q * 7) * 6 * q;
        const y = p.y + p.vy * e - q * 4;
        const size = p.s * (1 - q * 0.55);
        const f1 = 1 - q;
        ctx.globalAlpha = p.a * f1 * Math.sqrt(f1);
        if (ctx.fillStyle !== p.c) ctx.fillStyle = p.c;
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const easeA = (a: number) => a * a * (3 - 2 * a) * 0.35 + a * 0.65;
    const f0 = () => (vw < 700 ? 1.16 : 1); // phones start a touch further along so the second card fits

    // Phones: the glide is a keyframe animation tied to the scroll, so the graphics chip plays it smoothly.
    let anims: ScrollAnim[] = [];
    const build = () => {
      anims.forEach((a) => a.anim.cancel());
      anims = [];
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
    };

    let raf = 0, live = false, lastP = -1, dusting = false;
    const setDusting = (on: boolean) => {
      if (on === dusting) return;
      dusting = on;
      // The canvas takes over from the page text for as long as the dust is on screen.
      sec.classList.toggle('jr-snap', on);
      if (!on) snap = null;
    };
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
      if (coarse) anims.forEach((x) => x.set(p));
      else {
        const scale = 0.92 + 0.18 * easeA(a);
        track.style.transformOrigin = `${focus.toFixed(1)}px 0`;
        track.style.transform = `translate3d(${(vw / 2 - focus).toFixed(1)}px,0,0) scale(${scale.toFixed(4)})`;
        fill.style.transform = `scaleX(${(focus / (S * n)).toFixed(4)})`;
      }
      items.forEach((it, i) => it.classList.toggle('on', S * (i + 0.5) <= focus + S * 0.3));
      if (b > 0 && !dusting) { snap = takeSnap(); setDusting(true); }
      else if (b <= 0) setDusting(false);
      drawDust(b);
    };
    const start = () => { if (!live) { live = true; lastP = -1; raf = requestAnimationFrame(frame); } };
    const stop = () => { live = false; cancelAnimationFrame(raf); };
    const io = new IntersectionObserver((es) => (es[0].isIntersecting ? start() : stop()), { rootMargin: '200px 0px' });

    const onResize = () => {
      if (coarse && window.innerWidth === lastW) return; // phones: ignore address-bar height changes
      lastW = window.innerWidth;
      setDusting(false);
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
