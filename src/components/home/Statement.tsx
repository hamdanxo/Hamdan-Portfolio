const text =
  'I bring design and development together to build brands, websites and systems that work as well as they look. Clear thinking, careful detail and reliable delivery, from the first idea to the finished product.';

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
