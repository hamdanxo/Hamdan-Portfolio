import type { CSSProperties } from 'react';

type Blob = CSSProperties & { color: string };

/** Soft ambient light behind the glass. Radial gradients instead of blur filters: same look, far cheaper to paint. */
/** Mostly the dark red-purple of the hero waves, with a little of the site blue. */
const blobs: Blob[] = [
  { top: -160, left: -120, width: 620, height: 620, color: 'var(--accent)', opacity: 0.25 },
  { top: 220, right: -180, width: 540, height: 540, color: '#7A1A44', opacity: 0.32 },
  { top: 1500, left: '30%', width: 700, height: 700, color: '#4A1878', opacity: 0.3 },
  { top: 2700, right: -100, width: 560, height: 560, color: '#7A1A44', opacity: 0.28 },
  { top: 3900, left: -160, width: 620, height: 620, color: '#40749E', opacity: 0.15 },
  { bottom: -200, left: -100, width: 640, height: 640, color: '#4A1878', opacity: 0.3 },
];

const violet: CSSProperties[] = [
  { top: 900, right: -160, width: 520, height: 520, opacity: 0.5 },
  { top: 2200, left: -180, width: 600, height: 600, opacity: 0.42 },
  { top: 3600, left: '40%', width: 560, height: 560, opacity: 0.4 },
];

/** Faint copies of the hero light band running through the page, so the hero light seems to carry on. */
const echoes: CSSProperties[] = [
  { top: 1100, left: '-25%', width: '120%', transform: 'scaleX(-1) rotate(-6deg)', opacity: 1 },
  { top: 2500, right: '-30%', width: '125%', transform: 'rotate(8deg)', opacity: 0.9 },
  { top: 4000, left: '-20%', width: '115%', transform: 'scaleX(-1) rotate(4deg)', opacity: 0.85 },
];

export default function Glows() {
  return (
    <div aria-hidden="true" id="glows">
      {echoes.map((s, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={`e${i}`} className="echo" src={i === 1 ? '/hero/waves/rp-13.webp' : '/hero/waves/rp-14.webp'} alt="" loading="lazy" decoding="async" style={s} />
      ))}
      {violet.map((s, i) => <div key={`v${i}`} className="vg" style={s} />)}
      {blobs.map(({ color, ...s }, i) => (
        <div key={i} className="glow" style={{ ...s, background: `radial-gradient(closest-side, ${color}, transparent)` }} />
      ))}
    </div>
  );
}
