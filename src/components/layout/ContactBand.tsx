import QuickMessage from './QuickMessage';

/** Slim contact band (thin border, violet arc, mouse light via ContactSpotlight). Used on every page. */
export default function ContactBand({ label, title, sub = 'Open to internships and new projects.' }: { label: string; title: string; sub?: string }) {
  return (
<div className="ct" id="contactBand">
<div className="ct-spot" aria-hidden="true"></div>
<div className="ct-spot2" aria-hidden="true"></div>
<div className="ct-arc" aria-hidden="true"></div>
<div className="ct-l">
<p className="ct-label">{label}</p>
<h2 className="ct-h">{title}</h2>
<p className="ct-sub">{sub}</p>
</div>
<div className="ct-r">
<a className="ct-mail" href="mailto:hamdansameer2005@gmail.com?subject=Hey%20Hamdan%2C%20saw%20your%20portfolio">hamdansameer2005@gmail.com<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg></a>

</div>
<QuickMessage />
</div>
  );
}
