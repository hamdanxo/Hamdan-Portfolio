import Link from 'next/link';
import HeaderScroll from './HeaderScroll';

type Page = 'home' | 'design' | 'work';

export default function SiteHeader({ page }: { page: Page }) {
  const home = page === 'home';
  const hash = (id: string) => (home ? `#${id}` : `/#${id}`);
  const pageLink = (href: string, label: string, key: Page) => (
    <Link href={href} className="nl nl-page" aria-current={page === key ? 'page' : undefined}>
      {label}
    </Link>
  );
  return (
    <div className="site-header" id="siteHeader">
      <header>
        {home ? (
          <a href="#card" className="brand">MH<span>.</span></a>
        ) : (
          <Link href="/" className="brand">MH<span>.</span></Link>
        )}
        <nav aria-label="Main">
          {pageLink('/design', 'Design', 'design')}
          {pageLink('/work', 'Work', 'work')}
          <a className="nl" href={hash('about')}>About</a>
          <a className="nl" href={hash('education')}>Education</a>
          <a className="nl" href={hash('skills')}>Skills</a>
          <a href={hash('contact')} className="nav-cta">Contact</a>
        </nav>
      </header>
      <HeaderScroll />
    </div>
  );
}
