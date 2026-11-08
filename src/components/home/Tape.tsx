import TapeWords from './TapeWords';
import { tapeWords } from './tapeList';

// One half of the moving dashes: [gap before, length] in px. The half is repeated so the loop is seamless.
const bars: [number, number][] = [
  [60, 150], [190, 46], [120, 84], [240, 160], [150, 44], [210, 150],
  [90, 70], [260, 150], [140, 46], [200, 120], [110, 150], [230, 60],
];
const shots = [1, 2, 3, 4, 5, 6];

/** Thin moving strip under the hero: dashes slide along a line over a blurred band of my work, and a pill names what I do. Never pauses. */
export default function Tape() {
  return (
    <section className="tape" aria-label="What I do">
      <p className="sr-only">{tapeWords.map((w) => w.text).join(', ')}</p>
      <div className="tape-bg" aria-hidden="true">
        <div className="tape-bg-track">
          {[0, 1].map((half) => shots.map((n) => <span key={`${half}-${n}`} style={{ backgroundImage: `url(/tape/${n}.webp)` }} />))}
        </div>
      </div>
      <div className="tape-line" aria-hidden="true" />
      <div className="tape-bars" aria-hidden="true">
        <div className="tape-bars-track">
          {[0, 1].map((half) => (
            <div className="tape-half" key={half}>
              {bars.map(([gap, len], i) => <i key={i} style={{ marginLeft: gap, width: len }} />)}
            </div>
          ))}
        </div>
      </div>
      <TapeWords />
    </section>
  );
}
