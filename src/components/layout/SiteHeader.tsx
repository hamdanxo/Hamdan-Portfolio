import Link from 'next/link';

type Page = 'home' | 'design' | 'work';

const linkStyle = { padding: '12px 14px', color: '#B9FBF9', textDecoration: 'none' } as const;
const activeStyle = { ...linkStyle, color: '#FFFFFF', borderBottom: '1px solid var(--accent)' } as const;

export default function SiteHeader({ page }: { page: Page }) {
  const home = page === 'home';
  const hash = (id: string) => (home ? `#${id}` : `/#${id}`);
  const pageLink = (href: string, label: string, key: Page) => (
    <Link href={href} aria-current={page === key ? 'page' : undefined} style={page === key ? activeStyle : linkStyle}>
      {label}
    </Link>
  );
  return (
    <div className="site-header">
      <header className="glass">
        {home ? (
          <a href="#card" className="brand">MH<span>.</span></a>
        ) : (
          <Link href="/" className="brand">MH<span>.</span></Link>
        )}
        <nav className="mono" aria-label="Main">
          {pageLink('/design', 'Design', 'design')}
          {pageLink('/work', 'Work', 'work')}
          <a href={hash('about')} style={linkStyle}>About</a>
          <a href={hash('education')} style={linkStyle}>Education</a>
          <a href={hash('skills')} style={linkStyle}>Skills</a>
          <a href={hash('contact')} className="nav-cta">Contact</a>
        </nav>
      </header>
    </div>
  );
}
