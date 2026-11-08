'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import { tapeWords } from './tapeList';



const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** The pill on the strip: every few seconds the word scrambles into the next thing I do. */
export default function TapeWords() {
  const word = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLElement>(null);

  useEffect(() => {
    const w = word.current, d = dot.current;
    if (!w || !d) return;
    const reduce = prefersReducedMotion();
    let i = 0, raf = 0;
    const show = (next: number) => {
      const target = tapeWords[next].text.toUpperCase();
      d.style.background = tapeWords[next].dot;
      if (reduce) { w.textContent = target; return; }
      const t0 = performance.now(), dur = 650;
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const fixed = Math.floor(p * target.length);
        let s = target.slice(0, fixed);
        for (let k = fixed; k < target.length; k++) s += target[k] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        w.textContent = s;
        if (p < 1) raf = requestAnimationFrame(step);
      };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    };
    const timer = window.setInterval(() => { i = (i + 1) % tapeWords.length; show(i); }, 2800);
    return () => { window.clearInterval(timer); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="tape-pill">
      <i ref={dot} className="tape-dot" style={{ background: tapeWords[0].dot }} />
      <span ref={word} className="tape-word">{tapeWords[0].text.toUpperCase()}</span>
    </div>
  );
}
