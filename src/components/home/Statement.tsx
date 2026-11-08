const text =
  'I design brand material, build websites and run marketing for companies in Dubai. Right now that means company profiles, product launches and the systems that run behind them.';

/** Big statement whose words fill in as you scroll (see ScrollFill). */
export default function Statement() {
  return (
    <section className="stmt" id="statement" aria-label="What I do">
      <p className="stmt-text">
        {text.split(' ').map((w, i) => (
          <span className="fw" key={i}>{w} </span>
        ))}
      </p>
    </section>
  );
}
