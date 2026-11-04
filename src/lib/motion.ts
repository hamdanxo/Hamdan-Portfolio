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
