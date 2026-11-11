/** The portfolio's brand identity: logo, colours, type and small UI pieces, shown like a studio brand sheet. */

export const PALETTE = [
  { name: 'Ink', hex: '#050708', use: 'Background', dark: true },
  { name: 'Graphite', hex: '#0B0D0F', use: 'Panels and cards', dark: true },
  { name: 'Ice', hex: '#8CBEF2', use: 'Accent and links' },
  { name: 'Violet', hex: '#5B3DF5', use: 'Business card', dark: true },
  { name: 'Mist', hex: '#9FB0C0', use: 'Body text' },
  { name: 'Frost', hex: '#F2F5F8', use: 'Headings' },
];

const TYPE = [
  { name: 'Geist', use: 'Headings and the name', cls: 'bb-geist', sample: 'Aa' },
  { name: 'Cormorant Garamond', use: 'The signature italic', cls: 'bb-serif', sample: 'Aa' },
  { name: 'Manrope', use: 'Body text', cls: 'bb-body', sample: 'Aa' },
  { name: 'DM Mono', use: 'Labels and small caps', cls: 'bb-mono', sample: 'Aa' },
];

/** The logo: an MH monogram with an ice blue full stop. */
export function Mark({ light = false }: { light?: boolean }) {
  return <span className={`bb-mark${light ? ' bb-mark-light' : ''}`} aria-label="MH logo">MH<i>.</i></span>;
}

/** Small tile for the home page card: the logo on Ink. */
export function LogoTile() {
  return (
    <div className="bb-tile bb-tile-logo">
      <Mark />
      <span className="bb-word">Muhammad <em>Hamdan</em></span>
    </div>
  );
}

/** Small tile for the home page card: the palette as stripes. */
export function PaletteTile() {
  return (
    <div className="bb-tile bb-tile-pal">
      {PALETTE.map((c) => (
        <span key={c.hex} style={{ background: c.hex }} className={c.dark ? 'is-dark' : ''}><b>{c.hex}</b></span>
      ))}
    </div>
  );
}

/** The full brand sheet for the Work page. */
export default function BrandBoard() {
  return (
    <div className="bb" aria-label="Brand identity">
      <div className="bb-head">
        <h4>Brand identity</h4>
        <p>The logo, colours and type I made for my own brand, used across this site and my business card.</p>
      </div>
      <div className="bb-grid">
        <div className="bb-cell bb-logo">
          <span className="bb-label">Logo</span>
          <Mark />
          <span className="bb-word">Muhammad <em>Hamdan</em></span>
        </div>
        <div className="bb-cell bb-logo bb-logo-light">
          <span className="bb-label">On light</span>
          <Mark light />
          <span className="bb-word">Muhammad <em>Hamdan</em></span>
        </div>
        <div className="bb-cell bb-pal">
          <span className="bb-label">Colour palette</span>
          <div className="bb-swatches">
            {PALETTE.map((c) => (
              <div className="bb-sw" key={c.hex}>
                <span className="bb-chip" style={{ background: c.hex }} />
                <b>{c.name}</b>
                <code>{c.hex}</code>
                <small>{c.use}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="bb-cell bb-type">
          <span className="bb-label">Typography</span>
          <div className="bb-fonts">
            {TYPE.map((t) => (
              <div className="bb-font" key={t.name}>
                <span className={`bb-aa ${t.cls}`}>{t.sample}</span>
                <b>{t.name}</b>
                <small>{t.use}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="bb-cell bb-ui">
          <span className="bb-label">Elements</span>
          <div className="bb-els">
            <span className="bb-el-tag">Web developer</span>
            <span className="bb-el-link">Get in touch</span>
            <span className="bb-el-line" />
            <span className="bb-el-dot"><i />Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
