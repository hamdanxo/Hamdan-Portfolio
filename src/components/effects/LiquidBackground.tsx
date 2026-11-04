'use client';

import { useEffect, useRef } from 'react';
import { hasWebGL, prefersReducedMotion } from '@/lib/motion';

const WAKE_EVENTS = ['pointermove', 'pointerdown', 'scroll', 'wheel', 'touchstart', 'keydown'] as const;

/**
 * Liquid-metal background rendered with Three.js.
 * Three.js is fetched only after the visitor first interacts with the page and the
 * browser is idle, so it never competes with the first paint (LCP) or delays input (INP).
 * Devices without a real GPU get a single still frame; touch devices get a still CSS version.
 */
export default function LiquidBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    // Phones and tablets get a still CSS version (see globals.css): no WebGL work competing with scrolling.
    if (window.matchMedia('(pointer: coarse)').matches || !hasWebGL()) return;
    let disposed = false;
    let stop: (() => void) | undefined;

    const start = async () => {
      const { createLiquidScene } = await import('./liquidScene');
      if (disposed) return;
      const small = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900;
      let scene;
      try {
        scene = createLiquidScene(canvas, small ? 0.32 : 0.5);
      } catch {
        return; // No WebGL: the plain dark background stays.
      }
      const frameGap = 1000 / (small ? 24 : 30);

      const t0 = performance.now() - 20000;
      const gl = scene.renderer.getContext();
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      const gpu = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
      const software = /swiftshader|llvmpipe|software|basic render/i.test(gpu);

      scene.draw((performance.now() - t0) / 1000);
      canvas.classList.add('ready');
      window.addEventListener('resize', scene.resize);

      // If the device cannot keep up (frames arriving slower than ~20 fps), freeze on the current frame.
      let raf = 0, last = 0, frames = 0, firstFrame = 0, running = !(prefersReducedMotion() || software);
      const loop = (now: number) => {
        if (!running) return;
        raf = requestAnimationFrame(loop);
        if (now - last < frameGap) return;
        last = now;
        scene.draw((now - t0) / 1000);
        if (frames === 0) firstFrame = now;
        if (++frames === 30 && (now - firstFrame) / 29 > 50) running = false;
      };
      const onVisibility = () => {
        cancelAnimationFrame(raf);
        if (!document.hidden && running) raf = requestAnimationFrame(loop);
      };
      document.addEventListener('visibilitychange', onVisibility);
      if (running) raf = requestAnimationFrame(loop);

      stop = () => {
        running = false;
        cancelAnimationFrame(raf);
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('resize', scene.resize);
        scene.dispose();
      };
    };

    let idle = 0;
    const wake = () => {
      WAKE_EVENTS.forEach((e) => window.removeEventListener(e, wake));
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      idle = ric ? ric(() => { void start(); }, { timeout: 1500 }) : window.setTimeout(() => { void start(); }, 300);
    };
    WAKE_EVENTS.forEach((e) => window.addEventListener(e, wake, { passive: true, once: true }));

    return () => {
      disposed = true;
      WAKE_EVENTS.forEach((e) => window.removeEventListener(e, wake));
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (cic) cic(idle); else window.clearTimeout(idle);
      stop?.();
    };
  }, []);

  return <canvas id="liquid" ref={ref} aria-hidden="true" />;
}
