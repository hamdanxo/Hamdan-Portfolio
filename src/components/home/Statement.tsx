const text =
  'I bring design and development together to build brands, websites and systems that work as well as they look. Clear thinking, careful detail and reliable delivery, from the first idea to the finished product.';
/** Words that light up red instead of white. */
const KEY = new Set(['design', 'development', 'brands,', 'websites', 'systems', 'finished', 'product.']);

/** Pinned statement: the words come out of a blur one by one as you scroll, a red light travels behind them. */
export default function Statement() {
  return (
    <section className="stmt" id="statement" aria-label="What I do">
      <div className="stmt-pin">
        <i className="stmt-glow" aria-hidden="true" />
        <i className="stmt-ring" aria-hidden="true" />
        <p className="mono stmt-k"><span className="stmt-n">00</span> / What I do</p>
        <p className="stmt-text">
          {text.split(' ').map((w, i) => (
            <span className={KEY.has(w) ? 'fw fk' : 'fw'} key={i}>{w} </span>
          ))}
        </p>
        <i className="stmt-bar" aria-hidden="true"><b /></i>
      </div>
    </section>
  );
}
