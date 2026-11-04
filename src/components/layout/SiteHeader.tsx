import Link from 'next/link';

type Page = 'home' | 'work';

const linkStyle = { padding: '12px 14px', color: '#B9FBF9', textDecoration: 'none' } as const;

export default function SiteHeader({ page }: { page: Page }) {
  const home = page === 'home';
  const hash = (id: string) => (home ? `#${id}` : `/#${id}`);
  return (
    <div className="site-header">
      <header className="glass">
        {home ? (
          <a href="#card" className="brand">MH<span>.</span></a>
        ) : (
          <Link href="/" className="brand">MH<span>.</span></Link>
        )}
        <nav className="mono" aria-label="Main">
          <Link
            href="/work"
            aria-current={home ? undefined : 'page'}
            style={home ? linkStyle : { ...linkStyle, color: '#FFFFFF', borderBottom: '1px solid var(--accent)' }}
          >
            Work
          </Link>
          <a href={hash('about')} style={linkStyle}>About</a>
          <a href={hash('education')} style={linkStyle}>Education</a>
          <a href={hash('skills')} style={linkStyle}>Skills</a>
          <a href={hash('contact')} className="nav-cta">Contact</a>
        </nav>
      </header>
    </div>
  );
}
