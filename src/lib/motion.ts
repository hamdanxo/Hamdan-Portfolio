/** Shared helpers for client-side motion. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/** Run a callback once the browser is idle (falls back to a timeout). */
export function whenIdle(cb: () => void, timeout = 2000): () => void {
  const w = window as Window & {
    requestIdleCallback?: (fn: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(cb, { timeout });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(cb, 200);
  return () => window.clearTimeout(id);
}

/** WebGL support, checked once with a throwaway context (no console errors). */
let webglCache: { ok: boolean; software: boolean } | undefined;
export function webglInfo(): { ok: boolean; software: boolean } {
  if (webglCache) return webglCache;
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return (webglCache = { ok: false, software: false });
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const gpu = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    webglCache = { ok: true, software: /swiftshader|llvmpipe|software|basic render/i.test(gpu) };
  } catch {
    webglCache = { ok: false, software: false };
  }
  return webglCache;
}

/** True when the browser can create a WebGL context. */
export const hasWebGL = (): boolean => webglInfo().ok;

/** True when the browser can run scroll-driven animations (ViewTimeline). */
export const hasViewTimeline = (): boolean => typeof window !== 'undefined' && 'ViewTimeline' in window;

export type ScrollAnim = { anim: Animation; set: (p: number) => void; driven: boolean };

/**
 * Ties keyframes to how far a tall pinned section has been scrolled: offset 0 when its top reaches the top of the
 * screen, offset 1 when its bottom reaches the bottom. Where the browser supports scroll-driven animations the
 * graphics chip runs it, so it moves exactly with the finger. Otherwise call set(p) from a frame loop.
 */
export function scrollAnim(el: Element, subject: Element, frames: Keyframe[]): ScrollAnim {
  const VT = (window as Window & { ViewTimeline?: new (o: { subject: Element; axis: string }) => AnimationTimeline }).ViewTimeline;
  if (VT) {
    const opts = { fill: 'both', easing: 'linear', timeline: new VT({ subject, axis: 'block' }), rangeStart: 'contain 0%', rangeEnd: 'contain 100%' };
    const anim = el.animate(frames, opts as KeyframeAnimationOptions);
    return { anim, set: () => {}, driven: true };
  }
  const anim = el.animate(frames, { duration: 1000, fill: 'both', easing: 'linear' });
  anim.pause();
  return { anim, set: (p) => { anim.currentTime = p * 1000; }, driven: false };
}
