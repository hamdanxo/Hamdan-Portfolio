const clients = ['Lapiz Blue', 'Global Classic'];

/** Slow moving "worked with" line of client names. Add new clients to the list above. */
export default function ClientStrip() {
  // Repeat the names so the moving line never shows a gap.
  const row = Array.from({ length: 6 }, () => clients).flat();
  return (
    <section className="cl" aria-label="Clients I have worked with">
      <p className="cl-label">Worked with</p>
      <p className="sr-only">{clients.join(', ')}</p>
      <div className="cl-view" aria-hidden="true">
        <div className="cl-track">
          {[0, 1].map((half) => (
            <div className="cl-half" key={half}>
              {row.map((c, i) => (
                <span key={i}>{c}<i>✦</i></span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
