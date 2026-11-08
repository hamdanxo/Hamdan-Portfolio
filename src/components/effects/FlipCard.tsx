'use client';

import { hasViewTimeline, prefersReducedMotion, scrollAnim } from '@/lib/motion';
import { useIdleEffect } from '@/lib/useIdleEffect';

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Drives the hero: lays out the hand + card for the screen shape,
 * keeps the card text crisp (--k scale) and spins the card with scroll.
 */
export default function FlipCard() {
  useIdleEffect(() => {
    const sec = document.getElementById('card');
    const box = document.getElementById('flipBox');
    const card = document.getElementById('flipCard');
    const inner = document.getElementById('flipInner');
    const ht = document.getElementById('heroText');
    if (!sec || !box || !card || !inner || !ht) return;
    const reduce = prefersReducedMotion();

    const layout = () => {
      const vw = window.innerWidth, vh = window.innerHeight, stack = vw <= 900 || vw / vh < 1.15;
      document.documentElement.classList.toggle('hero-stack', stack);
      document.documentElement.classList.toggle('hero-short', vh < 1000);
      if (!stack) { box.removeAttribute('style'); return; }
      let tb = 0;
      for (const c of Array.from(ht.children) as HTMLElement[]) if (c.offsetHeight) tb = Math.max(tb, c.offsetTop + c.offsetHeight);
      tb += ht.offsetTop;
      let w = Math.min(vw * 0.88, 560) / 0.42;
      const hMax = (vh - 48 - tb) / 0.86;
      w = Math.max(Math.min(w, hMax * 1.5), vw * 0.8);
      const h = w / 1.5;
      box.style.cssText = `width:${w.toFixed(0)}px;left:${Math.min(vw / 2 - 0.355 * w, vw * 0.06).toFixed(0)}px;top:${(tb + 48 + 0.16 * h).toFixed(0)}px;right:auto;bottom:auto`;
    };
    const fit = () => { layout(); card.style.setProperty('--k', (card.clientWidth / 359).toFixed(4)); };
    document.fonts?.ready.then(fit);

    const target = () => {
      const r = sec.getBoundingClientRect(), span = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / span));
      return ease(Math.min(1, Math.max(0, (p - 0.05) / 0.8)));
    };
    const fine = window.matchMedia('(pointer: fine)').matches && window.innerWidth > 900;
    const sheens = Array.from(inner.querySelectorAll<HTMLElement>('.sheen'));
    const foil = document.getElementById('cardFoil');
    let cur = 0, last = -1, raf = 0, live = true;

    // Mouse tilt: the card leans toward the cursor and the shine and foil follow it (desktop only).
    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (fine && !reduce) window.addEventListener('pointermove', onMove, { passive: true });

    // Live Dubai time on the front of the card.
    const clock = document.getElementById('cardTime');
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dubai', hour: 'numeric', minute: '2-digit' });
    const tick = () => { if (clock) clock.textContent = `Dubai  ${fmt.format(new Date())}`; };
    tick();
    const clockTimer = window.setInterval(tick, 15000);
    const loop = () => {
      if (!live) return;
      raf = requestAnimationFrame(loop);
      const t = target();
      // Phones already scroll with their own momentum, so the card follows a little more directly there.
      cur += (t - cur) * (fine ? 0.09 : 0.16);
      if (Math.abs(t - cur) < 0.0005) cur = t;
      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;
      if (!fine && cur === last) return;
      last = cur;
      // One transform write per frame; no CSS variables, so the card's children never restyle.
      const fy = fine ? Math.sin(performance.now() / 1400) * 6 : 0;
      inner.style.transform = `translate3d(0,${fy.toFixed(2)}px,0) rotateZ(-9deg) rotateX(${(16 - my * 9).toFixed(2)}deg) rotateY(${(cur * 540 + mx * 14).toFixed(2)}deg)`;
      if (fine) {
        const sh = `${(100 - ((cur * 3) % 1) * 100 - mx * 28).toFixed(1)}% 0`;
        for (const el of sheens) el.style.backgroundPosition = sh;
        if (foil) foil.style.backgroundPosition = `${(50 + mx * 40 + cur * 70 - my * 10).toFixed(1)}% 50%`;
      }
    };

    // Phones fire resize while scrolling (the address bar shows and hides). Only re-layout when the width changes,
    // so the hand and card never jump mid-scroll.
    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastW && window.matchMedia('(pointer: coarse)').matches) return;
      lastW = window.innerWidth;
      fit();
    };
    window.addEventListener('resize', onResize);
    fit();
    // The loop only runs while the card section is on screen.
    const io = new IntersectionObserver(([e]) => {
      live = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (live && !reduce) raf = requestAnimationFrame(loop);
    });
    // Phones with scroll-driven animations: the spin is a keyframe animation the graphics chip plays in step with
    // the finger, so no frame loop is needed at all.
    let spin: Animation | undefined;
    if (!reduce && !fine && hasViewTimeline()) {
      const frames: Keyframe[] = [];
      for (let k = 0; k <= 48; k++) {
        const p = k / 48, c = ease(Math.min(1, Math.max(0, (p - 0.05) / 0.8)));
        frames.push({ offset: p, transform: `translate3d(0,0,0) rotateZ(-9deg) rotateX(16deg) rotateY(${(c * 540).toFixed(2)}deg)` });
      }
      spin = scrollAnim(inner, sec, frames).anim;
    } else if (!reduce) { cur = target(); io.observe(sec); }
    return () => {
      io.disconnect();
      spin?.cancel();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      window.clearInterval(clockTimer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
