import { work } from '@/data/designs';

/** Text that sits over the design wall at the top of the Design page. */
export default function DesignHero() {
  const count = work.length;
  const brands = new Set(work.map((d) => d.client)).size;
  return (
    <>
      <p className="dh-eye"><i aria-hidden="true" />Design</p>
      <h1 className="dh-title">Every idea,<br />made <em>visible.</em></h1>
      <p className="dh-lead">
        {count} designs for {brands} brands: brand boards, company profiles, launches and print.
      </p>
      <p className="dh-hint" aria-hidden="true">Drag · Scroll · Click</p>
    </>
  );
}
