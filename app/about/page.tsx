/**
 * About Page — Fully Server-Side Rendered
 *
 * Pure Server Component with zero client-side dependencies.
 * All content rendered in the initial HTML response for optimal SEO and AI scraping.
 *
 * NO "use client" directive
 * NO React hooks
 * NO dynamic imports with ssr: false
 */

import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'About Packfolio — npm Package Analytics Dashboard',
  description:
    'Learn about Packfolio, a free npm package analytics platform for tracking download statistics, trends, and package health. Server-side rendered for optimal SEO.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.packfolio.dev/about',
    title: 'About Packfolio — npm Package Analytics Dashboard',
    description:
      'Free npm analytics dashboard for tracking download statistics, health scores, and trends.',
  },
  alternates: {
    canonical: 'https://www.packfolio.dev/about',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'About Packfolio',
  description: 'Free npm package analytics dashboard for tracking download statistics and trends.',
  url: 'https://www.packfolio.dev/about',
  author: {
    '@type': 'Person',
    name: 'Hari C M',
    url: 'https://chemmangathari.in',
  },
  isPartOf: {
    '@type': 'WebApplication',
    name: 'Packfolio',
    url: 'https://www.packfolio.dev',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
};

// ─── Inline SVG icons (no emoji, no client-side icon lib) ───────────────────

const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const IconChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const IconBarChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);

const IconTheme = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);

const IconMobile = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
    <path d="M12 18h.01"/>
  </svg>
);

const IconFree = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

const IconLink = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const IconScore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>
  </svg>
);

// ─── Reusable card ───────────────────────────────────────────────────────────

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div style={{
      backgroundColor: '#161616',
      border: '1px solid #2a2a2a',
      borderRadius: '0.75rem',
      padding: '1.25rem',
      display: 'flex',
      gap: '0.875rem',
      alignItems: 'flex-start',
    }}>
      <div style={{
        flexShrink: 0,
        width: '2.25rem',
        height: '2.25rem',
        borderRadius: '0.5rem',
        backgroundColor: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ef4444',
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.3rem', fontFamily: 'monospace', color: '#f5f5f5' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#a3a3a3', lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div style={{
      backgroundColor: '#161616',
      border: '1px solid #2a2a2a',
      borderRadius: '0.75rem',
      padding: '1.25rem',
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start',
    }}>
      <div style={{
        flexShrink: 0,
        width: '2rem',
        height: '2rem',
        backgroundColor: '#ef4444',
        color: '#ffffff',
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: '0.9rem',
      }}>
        {number}
      </div>
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: '0.3rem', fontFamily: 'monospace', color: '#f5f5f5', fontSize: '0.9rem' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#a3a3a3', lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        strategy="beforeInteractive"
      />

      <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#f5f5f5' }}>
        <div style={{ maxWidth: '58rem', margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>

          {/* ── Header ── */}
          <header style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '1.75rem', fontWeight: 'bold' }}>$</span>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#f5f5f5', margin: 0 }}>
                Packfolio
              </h1>
            </div>
            <p style={{ fontSize: '1.1rem', color: '#a3a3a3', marginBottom: '1.75rem', lineHeight: 1.6 }}>
              A free, open-source npm package analytics platform — no account, no API key, no limits.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                href="/"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.6rem 1.25rem',
                  backgroundColor: '#ef4444', color: '#ffffff',
                  borderRadius: '0.5rem', fontFamily: 'monospace',
                  fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600,
                }}
              >
                Launch Dashboard
              </Link>
              <a
                href="https://chemmangathari.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.6rem 1.25rem',
                  backgroundColor: 'transparent', color: '#a3a3a3',
                  border: '1px solid #2a2a2a',
                  borderRadius: '0.5rem', fontFamily: 'monospace',
                  fontSize: '0.875rem', textDecoration: 'none',
                }}
              >
                <IconLink /> Creator's Website
              </a>
            </div>
          </header>

          {/* ── What is Packfolio ── */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '0.875rem', fontFamily: 'monospace', color: '#f5f5f5' }}>
              What is Packfolio?
            </h2>
            <p style={{ lineHeight: 1.75, marginBottom: '0.875rem', color: '#a3a3a3', fontSize: '0.9rem' }}>
              Packfolio is a web-based analytics dashboard for npm packages. Enter any npm username or package 
              name and get instant insight into download statistics, trend trajectories, package health, 
              and comparative analytics — all powered by npm's official public API.
            </p>
            <p style={{ lineHeight: 1.75, color: '#a3a3a3', fontSize: '0.9rem' }}>
              There is no backend infrastructure, no registration, and no data collection. Every API call 
              is made directly from your browser to npm's servers.
            </p>
          </section>

          {/* ── Features ── */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '1.25rem', fontFamily: 'monospace', color: '#f5f5f5' }}>
              Features
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.875rem' }}>
              <FeatureCard icon={<IconSearch />} title="Smart Search" description="Search by npm username or package name with live autocomplete suggestions and recent-search history." />
              <FeatureCard icon={<IconBarChart />} title="Comprehensive Statistics" description="Daily averages, weekly totals, monthly totals, and all-time download counts — calculated from 365 days of data." />
              <FeatureCard icon={<IconChart />} title="Interactive Charts" description="Trend lines, multi-package comparison, all-time distribution bar charts, and a 365-day download heatmap." />
              <FeatureCard icon={<IconScore />} title="Package Health Score" description="0–100 score based on download velocity, publish freshness, popularity, and GitHub community engagement." />
              <FeatureCard icon={<IconTheme />} title="Light & Dark Mode" description="Full theme support with persistent user preference stored locally in the browser." />
              <FeatureCard icon={<IconFree />} title="Completely Free" description="No registration, no API keys, no paywalls. Open source under the MIT License." />
              <FeatureCard icon={<IconMobile />} title="Fully Responsive" description="Optimised for mobile, tablet, and desktop. Works across all modern browsers." />
            </div>
          </section>

          {/* ── How to Use ── */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '1.25rem', fontFamily: 'monospace', color: '#f5f5f5' }}>
              How to Use
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Step number={1} title="Search for Packages" description='Enter an npm username (e.g., "sindresorhus") or a package name (e.g., "react", "@babel/core") in the search bar.' />
              <Step number={2} title="View Download Statistics" description="Instantly see daily, weekly, monthly, and all-time download metrics for each package and a combined total." />
              <Step number={3} title="Analyse Trends" description="Switch between the Overview, Charts, Globe, Timeline, and Developer tabs to explore different analytical views." />
              <Step number={4} title="Load More Packages" description='Packfolio loads the first 10 packages automatically. Click "Load More" to fetch additional packages in batches of 10.' />
            </div>
          </section>

          {/* ── Use Cases ── */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '1.25rem', fontFamily: 'monospace', color: '#f5f5f5' }}>
              Use Cases
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {[
                {
                  title: 'For Package Authors',
                  items: ['Track download growth and adoption trends', 'Monitor week-over-week velocity changes', 'Compare your packages side by side', 'See your impact score and rank'],
                },
                {
                  title: 'For Engineering Teams',
                  items: ['Evaluate package popularity before adoption', 'Track dependency download health', 'Make data-informed dependency decisions', 'Monitor ecosystem sustainability'],
                },
                {
                  title: 'For Researchers',
                  items: ['Analyse npm ecosystem trends at scale', 'Study open source adoption patterns', 'Research package lifecycle and maintenance', 'Gather data for academic publications'],
                },
              ].map((group) => (
                <div key={group.title} style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.75rem', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', fontFamily: 'monospace', color: '#f5f5f5' }}>
                    {group.title}
                  </h3>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {group.items.map((item) => (
                      <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#a3a3a3', fontSize: '0.8rem', lineHeight: 1.5 }}>
                        <span style={{ color: '#ef4444', flexShrink: 0, marginTop: '0.15rem' }}>—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── Data Accuracy Notice ── */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace', color: '#f5f5f5' }}>
              Data Accuracy Notice
            </h2>
            <div style={{ backgroundColor: '#1a1200', border: '1px solid #3d2e00', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#d4a017', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                <strong style={{ color: '#f0c040' }}>Important for developers interpreting statistics:</strong>
              </p>
              <p style={{ fontSize: '0.82rem', color: '#c89a14', lineHeight: 1.7 }}>
                npm download counts represent <strong>installation events</strong>, not unique users. 
                They include CI/CD pipeline runs, mirror pulls, automated dependency managers (Renovate, Dependabot), 
                and bot activity. The geographic breakdown on the globe is an estimate based on global 
                developer demographics — npm does not publish per-country data. 
                Always treat these figures as directional indicators rather than exact measurements.
              </p>
            </div>
          </section>

          {/* ── Technology Stack ── */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace', color: '#f5f5f5' }}>
              Technology Stack
            </h2>
            <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {[
                  ['Framework', 'Next.js 15 (React 19)'],
                  ['Language', 'TypeScript'],
                  ['Styling', 'Tailwind CSS'],
                  ['UI Components', 'Ant Design'],
                  ['Charts', 'Recharts'],
                  ['Globe', 'react-globe.gl'],
                  ['Analytics', 'Vercel Analytics & Speed Insights'],
                  ['Data Source', 'npm Registry & Downloads API'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', fontSize: '0.82rem' }}>
                    <span style={{ color: '#f5f5f5', fontFamily: 'monospace', flexShrink: 0 }}>{label}:</span>
                    <span style={{ color: '#a3a3a3' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Try These Examples ── */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace', color: '#f5f5f5' }}>
              Try These Examples
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {[
                { query: 'sindresorhus', desc: 'Prolific open source author' },
                { query: 'react', desc: 'React library' },
                { query: '@babel/core', desc: 'Babel compiler' },
                { query: 'expressjs', desc: 'Express.js framework' },
              ].map(({ query, desc }) => (
                <div key={query} style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
                  <code style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '0.875rem', display: 'block' }}>{query}</code>
                  <p style={{ fontSize: '0.75rem', marginTop: '0.3rem', color: '#737373' }}>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── About the Creator ── */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace', color: '#f5f5f5' }}>
              About the Creator
            </h2>
            <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.75rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem', fontFamily: 'monospace', color: '#f5f5f5' }}>
                Hari C M
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#a3a3a3', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                Packfolio was built by Hari C M, a developer focused on creating practical tools for the developer community. 
                The project was born from a simple need: quickly evaluate npm packages without juggling multiple tabs 
                and fragmented data sources. What started as a personal utility grew into a full-featured analytics platform.
              </p>
              <a
                href="https://chemmangathari.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ef4444', color: '#ffffff',
                  borderRadius: '0.375rem', fontFamily: 'monospace',
                  fontSize: '0.85rem', textDecoration: 'none',
                }}
              >
                <IconLink /> chemmangathari.in
              </a>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer style={{ borderTop: '1px solid #2a2a2a', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <p style={{ fontSize: '0.82rem', color: '#737373', fontFamily: 'monospace', textAlign: 'center' }}>
                Built for the npm community by Hari C M · Open source under the MIT License
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/" style={{ fontSize: '0.82rem', color: '#a3a3a3', fontFamily: 'monospace', textDecoration: 'none' }}>
                  Dashboard
                </Link>
                <a
                  href="https://chemmangathari.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.82rem', color: '#a3a3a3', fontFamily: 'monospace', textDecoration: 'none' }}
                >
                  chemmangathari.in
                </a>
                <Link href="/terms" style={{ fontSize: '0.82rem', color: '#a3a3a3', fontFamily: 'monospace', textDecoration: 'none' }}>
                  Terms &amp; Conditions
                </Link>
              </div>
            </div>
          </footer>

        </div>
      </main>
    </>
  );
}
