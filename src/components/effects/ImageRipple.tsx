'use client';

import { finePointer, prefersReducedMotion } from '@/lib/motion';
import { useIdleEffect } from '@/lib/useIdleEffect';

/**
 * Hovering a work image sends a short water ripple through it.
 * One shared SVG displacement filter, applied only while the ripple plays (under a second).
 */
export default function ImageRipple({ selector }: { selector: string }) {
  useIdleEffect(() => {
    if (prefersReducedMotion() || !finePointer()) return;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.innerHTML = '<filter id="ripple" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.026" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>';
    document.body.appendChild(svg);
    const turb = svg.querySelector('feTurbulence') as SVGFETurbulenceElement;
    const disp = svg.querySelector('feDisplacementMap') as SVGFEDisplacementMapElement;

    let raf = 0, active: HTMLElement | null = null;
    const stop = () => { cancelAnimationFrame(raf); if (active) active.style.filter = ''; active = null; };
    const play = (img: HTMLElement) => {
      stop();
      active = img;
      img.style.filter = 'url(#ripple)';
      const t0 = performance.now();
      const step = (now: number) => {
        const t = (now - t0) / 900;
        if (t >= 1) { stop(); return; }
        const k = Math.sin(t * Math.PI) * (1 - t);
        disp.setAttribute('scale', (k * 46).toFixed(2));
        turb.setAttribute('baseFrequency', `${(0.008 + t * 0.004).toFixed(4)} ${(0.026 - t * 0.008).toFixed(4)}`);
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const imgs = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const enter = (e: Event) => play(e.currentTarget as HTMLElement);
    imgs.forEach((i) => i.addEventListener('pointerenter', enter));
    return () => { stop(); imgs.forEach((i) => i.removeEventListener('pointerenter', enter)); svg.remove(); };
  }, [selector]);
  return null;
}
