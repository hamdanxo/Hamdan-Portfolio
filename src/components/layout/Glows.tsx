import type { CSSProperties } from 'react';

type Blob = CSSProperties & { color: string };

/** Soft ambient light behind the glass. Radial gradients instead of blur filters: same look, far cheaper to paint. */
const blobs: Blob[] = [
  { top: -160, left: -120, width: 620, height: 620, color: 'var(--accent)', opacity: 0.25 },
  { top: 220, right: -180, width: 540, height: 540, color: '#409E93', opacity: 0.18 },
  { top: 1500, left: '30%', width: 700, height: 700, color: 'var(--accent)', opacity: 0.17 },
  { top: 2700, right: -100, width: 560, height: 560, color: '#409E93', opacity: 0.15 },
  { bottom: -200, left: -100, width: 640, height: 640, color: '#42948A', opacity: 0.17 },
];

const violet: CSSProperties[] = [
  { top: 900, right: -160, width: 520, height: 520, opacity: 0.5 },
  { top: 2200, left: -180, width: 600, height: 600, opacity: 0.42 },
  { top: 3600, left: '40%', width: 560, height: 560, opacity: 0.4 },
];

export default function Glows() {
  return (
    <div aria-hidden="true" id="glows">
      {violet.map((s, i) => <div key={`v${i}`} className="vg" style={s} />)}
      {blobs.map(({ color, ...s }, i) => (
        <div key={i} className="glow" style={{ ...s, background: `radial-gradient(closest-side, ${color}, transparent)` }} />
      ))}
    </div>
  );
}
