'use client';

import { useEffect } from 'react';
import { prefersReducedMotion, scrollAnim, type ScrollAnim } from '@/lib/motion';

// Where the laptop screen sits in the close-up picture, as shares of its width and height.
const SW = 0.5476, SH = 0.6013;

type Point = { at: number; scale?: number; y?: number; opacity?: number; easing?: string };
const frames = (pts: Point[]): Keyframe[] =>
  pts.map((p) => {
    const k: Keyframe = { offset: p.at };
    if (p.scale !== undefined || p.y !== undefined) k.transform = `translate3d(0,${p.y ?? 0}px,0) scale(${p.scale ?? 1})`;
    if (p.opacity !== undefined) k.opacity = p.opacity;
    if (p.easing) k.easing = p.easing;
    return k;
  });

/**
 * Drives the classroom scene. Every step is a keyframe animation tied to the scroll position, which the graphics
 * chip plays where the browser supports scroll-driven animations (otherwise a light frame loop feeds it).
 */
export default function EducationMotion() {
  useEffect(() => {
    const sec = document.getElementById('education');
    if (!sec) return;
    const q = (s: string) => sec.querySelector<HTMLElement>(s);
    const pin = q('.ed-pin'), wide = q('.ed-wide'), close = q('.ed-close'), ui = q('.ed-ui'), veil = q('.ed-veil');
    const rows = Array.from(sec.querySelectorAll<HTMLElement>('.ed-row'));
    if (!pin || !wide || !close || !ui || !veil) return;
    if (prefersReducedMotion()) { sec.classList.add('ed-static'); return; }
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const smooth = 'cubic-bezier(.45,0,.55,1)';

    let anims: ScrollAnim[] = [];
    const build = () => {
      anims.forEach((a) => a.anim.cancel());
      anims = [];
      // How far to zoom at the end so the laptop screen fills the whole view.
      const vw = pin.clientWidth, vh = pin.clientHeight;
      const end = Math.max(vw / (close.offsetWidth * SW), vh / (close.offsetHeight * SH)) * 1.08;
      anims.push(
        // The page fades into the classroom, and back out at the very end.
        scrollAnim(veil, sec, frames([{ at: 0, opacity: 1 }, { at: 0.08, opacity: 0 }, { at: 0.86, opacity: 0 }, { at: 0.97, opacity: 1 }, { at: 1, opacity: 1 }])),
        // Walk into the room towards the student.
        scrollAnim(wide, sec, frames([
          { at: 0, scale: 1.02, opacity: 1, easing: smooth }, { at: 0.3, scale: 1.45, opacity: 1, easing: 'cubic-bezier(.5,0,.9,.5)' },
          { at: 0.37, scale: 2.2, opacity: 1 }, { at: 0.42, scale: 2.8, opacity: 0 }, { at: 1, scale: 2.8, opacity: 0 },
        ])),
        // Over his shoulder: the laptop settles, holds while you read, then the camera dives into the screen.
        scrollAnim(close, sec, frames([
          { at: 0, scale: 0.9, opacity: 0 }, { at: 0.39, scale: 0.9, opacity: 0 },
          { at: 0.46, scale: 0.97, opacity: 1, easing: smooth }, { at: 0.6, scale: 1, opacity: 1 },
          { at: 0.74, scale: 1, opacity: 1, easing: 'cubic-bezier(.55,0,.85,.4)' }, { at: 0.95, scale: end, opacity: 1 },
          { at: 1, scale: end, opacity: 1 },
        ])),
        scrollAnim(ui, sec, frames([{ at: 0, opacity: 0 }, { at: 0.48, opacity: 0 }, { at: 0.55, opacity: 1 }, { at: 0.74, opacity: 1 }, { at: 0.8, opacity: 0 }, { at: 1, opacity: 0 }])),
        ...rows.map((r, i) => scrollAnim(r, sec, frames([
          { at: 0, y: 14, opacity: 0 }, { at: 0.5 + i * 0.04, y: 14, opacity: 0 }, { at: 0.57 + i * 0.04, y: 0, opacity: 1 }, { at: 1, y: 0, opacity: 1 },
        ]))),
      );
    };

    // Browsers without scroll-driven animations: feed the progress from a frame loop while the scene is on screen.
    let raf = 0, live = false;
    const tick = () => {
      if (!live) return;
      raf = requestAnimationFrame(tick);
      const r = sec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - pin.clientHeight)));
      anims.forEach((a) => a.set(p));
    };
    const io = new IntersectionObserver(([e]) => {
      live = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (live && anims.some((a) => !a.driven)) raf = requestAnimationFrame(tick);
    }, { rootMargin: '200px 0px' });

    let lastW = window.innerWidth;
    const onResize = () => {
      if (coarse && window.innerWidth === lastW) return; // phones: ignore the address bar showing and hiding
      lastW = window.innerWidth;
      build();
    };
    build();
    io.observe(sec);
    window.addEventListener('resize', onResize);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); anims.forEach((a) => a.anim.cancel()); };
  }, []);
  return null;
}
