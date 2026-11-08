/**
 * Tiny isometric line-drawing helper for the "What I do" grid.
 * Boxes are described in grid units; each draws its three visible faces (filled with the cell colour so
 * nearer boxes hide farther ones), solid lines on the lit side and dashed lines on the shaded side.
 */
export type Box = { x: number; y: number; z?: number; w: number; d: number; h: number; accent?: boolean };

const C = Math.cos(Math.PI / 6);
const U = 22; // pixels per grid unit

const pt = (x: number, y: number, z: number): [number, number] => [(x - y) * C * U, ((x + y) * 0.5 - z) * U];
const poly = (ps: [number, number][]) => ps.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ');
const line = (a: [number, number], b: [number, number]) => `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;

type Shape = { accent: boolean; faces: string[]; solid: string; dashed: string; pts: [number, number][] };

function geometry(boxes: Box[]): { shapes: Shape[]; view: string } {
  // Farther and lower boxes first, so nearer ones are painted over them.
  const sorted = [...boxes].sort((a, b) => a.x + a.y + (a.z ?? 0) * 0.9 - (b.x + b.y + (b.z ?? 0) * 0.9));
  const shapes = sorted.map((b): Shape => {
    const z0 = b.z ?? 0, x1 = b.x + b.w, y1 = b.y + b.d, z1 = z0 + b.h;
    const t00 = pt(b.x, b.y, z1), t10 = pt(x1, b.y, z1), t11 = pt(x1, y1, z1), t01 = pt(b.x, y1, z1);
    const b10 = pt(x1, b.y, z0), b11 = pt(x1, y1, z0), b01 = pt(b.x, y1, z0);
    return {
      accent: !!b.accent,
      faces: [poly([t00, t10, t11, t01]), poly([t10, t11, b11, b10]), poly([t01, t11, b11, b01])],
      solid: [line(t00, t10), line(t10, t11), line(t11, t01), line(t01, t00), line(t10, b10), line(t11, b11), line(b10, b11)].join(''),
      dashed: [line(t01, b01), line(b01, b11)].join(''),
      pts: [t00, t10, t11, t01, b10, b11, b01],
    };
  });
  const all = shapes.flatMap((s) => s.pts);
  const xs = all.map((q) => q[0]), ys = all.map((q) => q[1]);
  const pad = 4, minX = Math.min(...xs) - pad, minY = Math.min(...ys) - pad;
  const view = `${minX.toFixed(0)} ${minY.toFixed(0)} ${(Math.max(...xs) + pad - minX).toFixed(0)} ${(Math.max(...ys) + pad - minY).toFixed(0)}`;
  return { shapes, view };
}

export function IsoArt({ boxes, label }: { boxes: Box[]; label: string }) {
  const { shapes, view } = geometry(boxes);
  return (
    <svg className="iso" viewBox={view} role="img" aria-label={label}>
      {shapes.map((sh, i) => (
        <g key={i} className={sh.accent ? 'iso-a' : undefined}>
          {sh.faces.map((f, k) => <polygon key={k} className="iso-f" points={f} />)}
          <path className="iso-s" d={sh.solid} />
          <path className="iso-d" d={sh.dashed} />
        </g>
      ))}
    </svg>
  );
}
