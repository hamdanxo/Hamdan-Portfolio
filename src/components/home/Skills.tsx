import { tools } from './toolIcons';

const strengths = [
  { name: 'Team work', note: 'Comfortable leading a group or getting on with it on my own.' },
  { name: 'Event organising', note: 'Planned and ran events for clients as an event coordinator.' },
  { name: 'Project management', note: 'Took a management system from an empty database to a working app.' },
];

const expertise = ['Management', 'Creativity', 'Digital marketing', 'Negotiation', 'Critical thinking', 'Leadership'];

export default function Skills() {
  return (
    <>
<section className="s-34e53a" id="skills">
<div className="s-e12feb">
<p className="mono s-f0b806">Skills and tools</p>
<h2 className="s-c994cd"><span className="h2l"><span>What I bring</span></span></h2>
</div>
<div className="sk-grid">
  <div className="sk-cell">
    <h3 className="sk-h">Strengths</h3>
    <ul className="sk-rows">
      {strengths.map((s) => (
        <li key={s.name}><b>{s.name}</b><span>{s.note}</span></li>
      ))}
    </ul>
  </div>
  <div className="sk-cell">
    <h3 className="sk-h">Expertise</h3>
    <ul className="sk-list">
      {expertise.map((e) => <li key={e}>{e}</li>)}
    </ul>
  </div>
  <div className="sk-cell">
    <h3 className="sk-h">Tech and tools</h3>
    <ul className="sk-tools">
      {tools.map((t) => (
        <li key={t.name} style={{ '--c': t.color } as React.CSSProperties}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={t.path} fillRule="evenodd" /></svg>
          <span>{t.name}</span>
        </li>
      ))}
    </ul>
  </div>
</div>
</section>
    </>
  );
}
