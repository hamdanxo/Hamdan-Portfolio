import type { Design } from '@/data/designs';

/** Size of one tile in CSS pixels, plus the gap between tiles. */
export type TileSize = { W: number; H: number; G: number };

/** Reads a next/font family list from its CSS variable, e.g. --font-geist. */
function fontFamily(variable: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return v || fallback;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** Same colour at zero alpha, so gradients fade like CSS `transparent` instead of through black. */
function transparent(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},0)`;
}

function radial(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, cx: number, cy: number, rx: number, ry: number, color: string, stop = 0.6) {
  // Elliptical radial gradient (rx, ry are fractions of the box), like CSS radial-gradient(rx ry at cx cy, color, transparent stop).
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.translate(x + cx * w, y + cy * h);
  ctx.scale(1, (ry * h) / (rx * w));
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * w);
  g.addColorStop(0, color);
  g.addColorStop(stop, transparent(color));
  ctx.fillStyle = g;
  ctx.fillRect(-rx * w * 2, -rx * w * 2, rx * w * 4, rx * w * 4);
  ctx.restore();
}

/** Placeholder art, matching the CSS .a1 to .a8 styles of the DOM gallery. */
function drawArt(ctx: CanvasRenderingContext2D, i: number, x: number, y: number, w: number, h: number) {
  const fill = (c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  switch (i % 8) {
    case 0: fill('#16181B'); radial(ctx, x, y, w, h, 0.25, 0.3, 0.9, 0.7, '#609CE5'); radial(ctx, x, y, w, h, 0.8, 0.8, 0.7, 0.7, '#4182E0'); break;
    case 1: fill('#060C10'); radial(ctx, x, y, w, h, 0.7, 0.25, 0.8, 0.8, '#6492B6'); radial(ctx, x, y, w, h, 0.2, 0.85, 0.7, 0.6, '#5D6E7E', 0.65); break;
    case 2: {
      const g = ctx.createLinearGradient(x, y, x + w * 0.35, y + h);
      g.addColorStop(0, '#DFEFFA'); g.addColorStop(0.45, '#C7E1F6'); g.addColorStop(1, '#6492B6');
      ctx.fillStyle = g; ctx.fillRect(x, y, w, h); break;
    }
    case 3: {
      const g = ctx.createConicGradient((210 - 90) * (Math.PI / 180), x + w * 0.5, y + h * 0.6);
      g.addColorStop(0, '#060C14'); g.addColorStop(0.2, '#5092E2'); g.addColorStop(0.4, '#060C14');
      g.addColorStop(0.6, '#6492B6'); g.addColorStop(0.8, '#060C14'); g.addColorStop(1, '#060C14');
      ctx.fillStyle = g; ctx.fillRect(x, y, w, h); break;
    }
    case 4: fill('#5D6E7E'); radial(ctx, x, y, w, h, 0.5, 0.5, 0.6, 0.6, '#C7E1F6', 0.62); break;
    case 5: {
      // CSS linear-gradient(135deg, dark 50%, violet 50%): violet where (px + py) > (w + h) / 2
      fill('#1B1C1E');
      const s = (w + h) / 2, far = w + h;
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      ctx.fillStyle = '#81B0EA';
      ctx.beginPath();
      ctx.moveTo(x + s, y); ctx.lineTo(x + s + far, y);
      ctx.lineTo(x + s + far, y + far); ctx.lineTo(x + s - far, y + far);
      ctx.closePath(); ctx.fill(); ctx.restore(); break;
    }
    case 6: fill('#0A0B0D'); radial(ctx, x, y, w, h, 0.3, 0.7, 0.7, 0.9, '#4182E0'); radial(ctx, x, y, w, h, 0.75, 0.25, 0.7, 0.7, '#6492B6'); break;
    case 7: {
      fill('#0E1114');
      ctx.fillStyle = '#161C20';
      for (let sx = 14; sx < w; sx += 28) ctx.fillRect(x + sx, y, Math.min(14, w - sx), h);
      const r = Math.min(w, h) * 0.28, cx = x + w / 2, cy = y + h / 2;
      const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
      g.addColorStop(0, '#DFEFFA'); g.addColorStop(0.45, '#6492B6'); g.addColorStop(1, '#1B2D3B');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, cy, w * 0.28, h * 0.28, 0, 0, Math.PI * 2); ctx.fill(); break;
    }
  }
}

function letterSpaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number, align: 'left' | 'right' | 'center') {
  ctx.letterSpacing = `${spacing}px`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
  ctx.letterSpacing = '0px';
}

/** Loads design images (if any) so they can be drawn into the atlas. */
export async function loadImages(items: Design[]): Promise<(HTMLImageElement | null)[]> {
  return Promise.all(items.map((d) => new Promise<HTMLImageElement | null>((resolve) => {
    if (!d.img) return resolve(null);
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => resolve(im);
    im.onerror = () => resolve(null);
    im.src = d.img;
  })));
}

/**
 * Draws every design card once into a single canvas (a texture atlas).
 * The WebGL gallery then shows hundreds of tiles from this one texture.
 */
export async function buildAtlas(items: Design[], images: (HTMLImageElement | null)[], size: TileSize, scale: number) {
  const { W, H } = size;
  // Lay the cards out roughly square, then shrink the resolution only if the atlas would pass
  // 4096px (the safe texture limit on phones). 20 designs stay full quality; 100 still look sharp.
  const n = Math.max(items.length, 1);
  const cols = Math.max(1, Math.min(n, Math.round(Math.sqrt((n * H) / W))));
  const rows = Math.ceil(n / cols);
  const MAX = 4096;
  const s = Math.min(scale, MAX / (cols * W), MAX / (rows * H));
  const cw = Math.floor(W * s), ch = Math.floor(H * s);
  const canvas = document.createElement('canvas');
  canvas.width = cw * cols;
  canvas.height = ch * rows;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');

  const sans = fontFamily('--font-geist', 'system-ui, sans-serif');
  const mono = fontFamily('--font-dm-mono', 'ui-monospace, monospace');

  for (let i = 0; i < items.length; i++) {
    const d = items[i];
    // Give the browser a breath between cards, so building the atlas never blocks input.
    if (i > 0) await new Promise((r) => setTimeout(r, 0));
    const ox = (i % cols) * cw, oy = Math.floor(i / cols) * ch;
    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(cw / W, ch / H);

    // card
    ctx.fillStyle = '#0A0B0C';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

    const pad = 14, small = W < 240;
    // top row
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `300 ${small ? 11 : 12}px ${sans}`;
    letterSpaced(ctx, d.client, pad, pad + 7, 0.24, 'left');
    ctx.fillStyle = '#C9D0D6';
    ctx.font = `300 ${small ? 8.5 : 9.5}px ${mono}`;
    letterSpaced(ctx, d.title.toUpperCase(), W - pad, pad + 7, 1.1, 'right');

    // art
    const top = pad + 14 + 10, bottom = H - pad - 20 - 10;
    const ax = W * 0.08 + pad, aw = W - 2 * ax, ah = bottom - top;
    ctx.save();
    roundRect(ctx, ax, top, aw, ah, 3);
    ctx.clip();
    const img = images[i];
    if (img && img.naturalWidth > img.naturalHeight * 1.1) {
      // A landscape book in a tall tile: show the whole cover, lying in the middle with a soft shadow.
      const bg = ctx.createRadialGradient(ax + aw / 2, top + ah * 0.45, 0, ax + aw / 2, top + ah * 0.45, ah * 0.8);
      bg.addColorStop(0, '#18212B');
      bg.addColorStop(1, '#07090C');
      ctx.fillStyle = bg;
      ctx.fillRect(ax, top, aw, ah);
      const s = (aw * 0.88) / img.naturalWidth;
      const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
      const x = ax + (aw - iw) / 2, y = top + (ah - ih) / 2;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 22;
      ctx.shadowOffsetY = 12;
      ctx.fillStyle = '#B9BFC6';
      ctx.fillRect(x + 2, y + 2, iw, ih); // page edges under the cover
      ctx.restore();
      ctx.drawImage(img, x, y, iw, ih);
    } else if (img) {
      const s = Math.max(aw / img.naturalWidth, ah / img.naturalHeight);
      const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
      ctx.drawImage(img, ax + (aw - iw) / 2, top + (ah - ih) / 2, iw, ih);
    } else {
      drawArt(ctx, i, ax, top, aw, ah);
      ctx.fillStyle = i % 8 === 2 || i % 8 === 4 ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.55)';
      ctx.font = `300 10px ${mono}`;
      ctx.textBaseline = 'middle';
      letterSpaced(ctx, d.title.toUpperCase(), ax + aw / 2, top + ah / 2, 1.8, 'center');
    }
    ctx.restore();

    // bottom row: tags + year
    const by = H - pad - 10;
    ctx.font = `300 ${small ? 8 : 8.5}px ${mono}`;
    ctx.textBaseline = 'middle';
    let tx = pad;
    for (const t of d.tags) {
      ctx.letterSpacing = '1px';
      const tw = ctx.measureText(t).width + 14;
      ctx.letterSpacing = '0px';
      roundRect(ctx, tx, by - 9, tw, 18, 2);
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.stroke();
      ctx.fillStyle = '#B4BCC4';
      letterSpaced(ctx, t, tx + 7, by + 0.5, 1, 'left');
      tx += tw + 5;
    }
    ctx.fillStyle = '#C9D0D6';
    ctx.font = `300 ${small ? 8.5 : 9.5}px ${mono}`;
    letterSpaced(ctx, d.year, W - pad, by, 1.1, 'right');

    ctx.restore();
  }

  return { canvas, cols, rows };
}
