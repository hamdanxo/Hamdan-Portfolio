import JourneyMotion from '@/components/effects/JourneyMotion';

const items = [
  { when: 'School', title: 'The Westminster School, Dubai', note: 'High School Diploma, O Levels and A Levels' },
  { when: '2023 to now', title: 'University of Wollongong in Dubai', note: 'Bachelor of Computer Science, Big Data and AI' },
  { when: '2023', title: 'Spreadsheet Management', note: 'The Mosbach Group' },
  { when: '2023 to 2024', title: 'Event Coordinator', note: 'Cheeky Monkeys' },
  { when: 'About 3 months', title: 'Entrepot Training Institute', note: '' },
  { when: 'Now', title: 'Graphic Designer and Marketing', note: 'Lapiz Blue General Trading, Dubai' },
];

/**
 * Horizontal timeline. The section pins while you scroll: the line glides sideways and zooms in,
 * each stop lights up as it reaches the middle, then the whole line breaks into dust and floats away.
 */
export default function Journey() {
  return (
    <section className="jr" id="journey" aria-label="Timeline">
      <div className="jr-pin">
        <div className="jr-head">
          <p className="jr-label">Timeline</p>
          <h2 className="jr-title">The journey so far</h2>
        </div>
        <div className="jr-stage">
          <ol className="jr-track" style={{ '--n': items.length } as React.CSSProperties}>
            <li className="jr-line" aria-hidden="true"><span className="jr-fill" /></li>
            {items.map((it, i) => (
              <li className={`jr-item ${i % 2 ? 'down' : 'up'}`} key={it.title} style={{ '--i': i } as React.CSSProperties}>
                <span className="jr-dot" aria-hidden="true" />
                <div className="jr-card">
                  <span className="jr-when">{it.when}</span>
                  <h3 className="jr-name">{it.title}</h3>
                  {it.note && <p className="jr-note">{it.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
        <canvas className="jr-dust" aria-hidden="true" />
      </div>
      <JourneyMotion />
    </section>
  );
}
