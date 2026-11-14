import { designTools } from './designTools';
import CreativeKitMotion from './CreativeKitMotion';

/**
 * The design and marketing toolkit as a fly-through: the section pins, and as you scroll each tool's logo
 * flies out of the dark towards you in its own colour, its name huge behind it, then rushes past.
 */
export default function CreativeKit() {
  return (
    <section className="ck" id="toolkit" aria-label="Design and marketing toolkit">
      <div className="ck-pin">
        <div className="ck-glow" aria-hidden="true" />
        <div className="ck-names" aria-hidden="true">
          {designTools.map((t) => <span key={t.name} className="ck-name" style={{ '--c': t.color } as React.CSSProperties}>{t.name}</span>)}
        </div>
        <div className="ck-space" aria-hidden="true">
          {designTools.map((t, i) => (
            <div key={t.name} className={t.stroke ? 'ck-tool ck-stroke' : 'ck-tool'} style={{ '--c': t.color, '--i': i } as React.CSSProperties}>
              <svg viewBox={t.vb ?? '0 0 24 24'}><path d={t.path} fillRule="evenodd" /></svg>
            </div>
          ))}
        </div>
        <div className="ck-head">
          <p className="mono ck-k">Design and marketing</p>
          <h2 className="ck-h">The creative kit</h2>
        </div>
        <p className="mono ck-count" aria-hidden="true"><span className="ck-n">01</span> / {String(designTools.length).padStart(2, '0')}</p>
        <ul className="ck-list">
          {designTools.map((t) => <li key={t.name}>{t.name}</li>)}
        </ul>
        <div className="ck-grid" aria-hidden="true">
          {designTools.map((t) => (
            <div key={t.name} className={t.stroke ? 'ck-cell ck-stroke' : 'ck-cell'} style={{ '--c': t.color } as React.CSSProperties}>
              <svg viewBox={t.vb ?? '0 0 24 24'}><path d={t.path} fillRule="evenodd" /></svg>
              <span>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
      <CreativeKitMotion />
    </section>
  );
}
