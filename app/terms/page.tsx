/**
 * Terms & Conditions Page — Fully Server-Side Rendered
 *
 * Standalone, crawlable T&C page with all developer-relevant disclosures.
 * Pure Server Component — no client dependencies.
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Packfolio',
  description:
    'Read the full Terms and Conditions for Packfolio, including data sources, download count methodology, geographic disclaimers, health score methodology, privacy policy, and legal notices.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.packfolio.dev/terms' },
};

// ─── Shared style tokens ─────────────────────────────────────────────────────

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#f5f5f5' },
  wrap: { maxWidth: '52rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' },
  h1: { fontSize: '1.75rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#f5f5f5', margin: 0 },
  h2: { fontSize: '1.05rem', fontWeight: 700, fontFamily: 'monospace', color: '#f5f5f5', margin: '0 0 0.75rem' },
  p: { fontSize: '0.85rem', color: '#a3a3a3', lineHeight: 1.8, margin: '0 0 0.75rem' },
  card: { backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.25rem' },
  warnCard: { backgroundColor: '#1a1200', border: '1px solid #3d2e00', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.25rem' },
  infoCard: { backgroundColor: '#001a2e', border: '1px solid #003358', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.25rem' },
  divider: { borderTop: '1px solid #2a2a2a', margin: '2rem 0' },
  label: { fontSize: '0.75rem', fontFamily: 'monospace', color: '#ef4444', textTransform: 'uppercase' as const, letterSpacing: '0.08em' },
  code: { fontFamily: 'monospace', fontSize: '0.8rem', backgroundColor: '#1c1c1c', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', color: '#ef4444' },
};

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
        <span style={{ ...styles.label }}>{number}</span>
        <div style={{ height: 1, flex: 1, backgroundColor: '#2a2a2a' }} />
      </div>
      <h2 style={styles.h2}>{title}</h2>
      {children}
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TermsPage() {
  return (
    <main style={styles.page}>
      <div style={styles.wrap}>

        {/* ── Header ── */}
        <header style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 'bold' }}>$</span>
            <h1 style={styles.h1}>Packfolio</h1>
          </div>
          <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f5f5f5', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
            Terms &amp; Conditions
          </p>
          <p style={{ fontSize: '0.82rem', color: '#737373', fontFamily: 'monospace' }}>
            Effective: 2025 · Last reviewed July 2025
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{ fontSize: '0.82rem', color: '#ef4444', fontFamily: 'monospace', textDecoration: 'none' }}>
              ← Back to Dashboard
            </Link>
            <Link href="/about" style={{ fontSize: '0.82rem', color: '#a3a3a3', fontFamily: 'monospace', textDecoration: 'none' }}>
              About Packfolio
            </Link>
          </div>
        </header>

        {/* ── Preamble ── */}
        <div style={{ ...styles.card, marginBottom: '2.5rem' }}>
          <p style={{ ...styles.p, margin: 0 }}>
            These Terms &amp; Conditions ("Terms") govern your use of Packfolio ("the Service"), 
            a free, open-source npm package analytics dashboard available at{' '}
            <span style={styles.code}>packfolio.dev</span>. 
            By accessing or using the Service, you agree to these Terms in full. 
            If you do not agree, please discontinue use immediately.
          </p>
        </div>

        {/* 1. Acceptance */}
        <Section number="01" title="Acceptance of Terms">
          <p style={styles.p}>
            Use of the Service constitutes your binding acceptance of these Terms. 
            Packfolio reserves the right to update these Terms at any time. 
            Continued use after updates constitutes acceptance of the revised Terms. 
            The most current version is always available at{' '}
            <span style={styles.code}>packfolio.dev/terms</span>.
          </p>
        </Section>

        {/* 2. Description of Service */}
        <Section number="02" title="Description of Service">
          <p style={styles.p}>
            Packfolio is a client-side web application that retrieves and visualises npm package 
            download statistics. The Service queries npm's official public APIs in real time, 
            directly from the user's browser. Packfolio does not operate a backend server, 
            does not store package data, and does not cache any statistics.
          </p>
        </Section>

        {/* 3. Data Sources */}
        <Section number="03" title="Data Sources">
          <p style={styles.p}>All data displayed by Packfolio originates exclusively from the following official public sources:</p>

          <div style={styles.card}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', color: '#f5f5f5', fontFamily: 'monospace', paddingBottom: '0.625rem', borderBottom: '1px solid #2a2a2a', paddingRight: '1rem' }}>Source</th>
                  <th style={{ textAlign: 'left', color: '#f5f5f5', fontFamily: 'monospace', paddingBottom: '0.625rem', borderBottom: '1px solid #2a2a2a', paddingRight: '1rem' }}>Endpoint</th>
                  <th style={{ textAlign: 'left', color: '#f5f5f5', fontFamily: 'monospace', paddingBottom: '0.625rem', borderBottom: '1px solid #2a2a2a' }}>Data Provided</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['npm Registry API', 'registry.npmjs.org', 'Package metadata, versioning, authorship, repository links'],
                  ['npm Downloads API', 'api.npmjs.org/downloads', 'Daily download counts up to 365 days of history'],
                  ['Shields.io / GitHub API', 'img.shields.io · api.github.com', 'GitHub repository star counts (unauthenticated)'],
                ].map(([source, endpoint, data], idx, arr) => (
                  <tr key={source}>
                    <td style={{ padding: '0.75rem 1rem 0.75rem 0', color: '#f5f5f5', fontFamily: 'monospace', borderBottom: idx < arr.length - 1 ? '1px solid #2a2a2a' : 'none', verticalAlign: 'top' }}>{source}</td>
                    <td style={{ padding: '0.75rem 1rem 0.75rem 0', color: '#ef4444', fontFamily: 'monospace', borderBottom: idx < arr.length - 1 ? '1px solid #2a2a2a' : 'none', verticalAlign: 'top' }}>{endpoint}</td>
                    <td style={{ padding: '0.75rem 0', color: '#a3a3a3', borderBottom: idx < arr.length - 1 ? '1px solid #2a2a2a' : 'none', verticalAlign: 'top' }}>{data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={styles.p}>
            Packfolio is subject to the availability, accuracy, and rate-limiting policies of these third-party APIs. 
            Packfolio has no control over npm's data pipeline or the accuracy of their published statistics.
          </p>
        </Section>

        {/* 4. Download Count Methodology — developer-critical */}
        <Section number="04" title="Download Count Methodology & Limitations">
          <div style={styles.warnCard}>
            <p style={{ fontSize: '0.85rem', color: '#f0c040', fontWeight: 700, marginBottom: '0.75rem' }}>
              Critical notice for developers interpreting statistics
            </p>
            <p style={{ fontSize: '0.82rem', color: '#c89a14', lineHeight: 1.8, marginBottom: '0.75rem' }}>
              npm download counts represent <strong>installation events</strong>, not unique users, 
              active projects, or distinct human consumers. The counts include, without limitation:
            </p>
            <ul style={{ fontSize: '0.82rem', color: '#c89a14', lineHeight: 1.8, paddingLeft: '1.25rem', margin: '0 0 0.75rem' }}>
              <li>CI/CD pipeline installations (often the majority for widely-used packages)</li>
              <li>Mirror and CDN proxy server pulls</li>
              <li>Automated dependency managers (Renovate, Dependabot, Snyk, etc.)</li>
              <li>Developer reinstalls across multiple machines, environments, and containers</li>
              <li>Bot, crawler, and automated tooling activity</li>
              <li>Package manager cache invalidation and re-resolution events</li>
            </ul>
            <p style={{ fontSize: '0.82rem', color: '#c89a14', lineHeight: 1.8, margin: 0 }}>
              This is a well-documented limitation of npm's public download statistics, not a deficiency 
              of Packfolio. Packfolio displays the raw numbers exactly as provided by npm's API. 
              <strong> Use download counts as relative trend indicators, not as measures of actual user adoption.</strong>
            </p>
          </div>
        </Section>

        {/* 5. Geographic Distribution */}
        <Section number="05" title="Geographic Distribution — Estimated Data Disclosure">
          <div style={styles.infoCard}>
            <p style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: 700, marginBottom: '0.75rem' }}>
              The geographic globe visualisation shows estimated, not actual, data.
            </p>
            <p style={{ fontSize: '0.82rem', color: '#93c5fd', lineHeight: 1.8, marginBottom: '0.75rem' }}>
              npm's public API does not provide per-country or per-region download data. 
              The geographic breakdown displayed on the globe is generated by applying a 
              static set of developer-population weights to a package's total all-time download count. 
              <strong> Every package uses the same regional distribution model</strong>, regardless of 
              where its actual users are located.
            </p>
            <p style={{ fontSize: '0.82rem', color: '#93c5fd', lineHeight: 1.8, margin: 0 }}>
              All country-level figures are prefixed with "~" (approximately) in the interface to reflect 
              their estimated nature. These figures should not be used for business decisions, marketing 
              targeting, or geographic audience analysis. Packfolio plans to improve geographic accuracy 
              in a future release.
            </p>
          </div>
        </Section>

        {/* 6. Health Score */}
        <Section number="06" title="Package Health Score Methodology">
          <p style={styles.p}>
            The Package Health Score (0–100) is a heuristic metric computed entirely client-side 
            from available data. It is <strong>not</strong> an official npm metric, rating, or endorsement. 
            The score is composed of four equally weighted factors (25 points maximum each):
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {[
              { name: 'Download Velocity', desc: 'Week-over-week change in daily download rate' },
              { name: 'Freshness', desc: 'Days elapsed since the most recent npm publish' },
              { name: 'Popularity', desc: 'Total all-time download volume on a logarithmic scale' },
              { name: 'Maintenance', desc: 'GitHub star count as a proxy for community engagement' },
            ].map((f) => (
              <div key={f.name} style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '0.875rem' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#f5f5f5', marginBottom: '0.25rem', fontWeight: 600 }}>{f.name}</p>
                <p style={{ fontSize: '0.78rem', color: '#737373', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <p style={styles.p}>
            The health score is provided for informational purposes only and should not be used as the 
            sole basis for package selection, security assessments, or production adoption decisions.
          </p>
        </Section>

        {/* 7. Rate Limiting */}
        <Section number="07" title="Rate Limiting & Acceptable Use">
          <p style={styles.p}>
            Packfolio implements client-side rate limiting (approximately 4 requests per second) to 
            respect npm's public API usage policies. You agree not to use the Service to conduct 
            automated scraping, bulk data extraction, or any activity that would result in an 
            unreasonable load on npm's infrastructure.
          </p>
          <p style={styles.p}>
            All API requests are made directly from your browser. Packfolio does not operate a proxy 
            or relay server between you and npm's APIs.
          </p>
        </Section>

        {/* 8. Privacy */}
        <Section number="08" title="Privacy & Data Collection">
          <div style={styles.card}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Personal Data', text: 'Packfolio does not collect, store, or process any personally identifiable information.' },
                { label: 'Search History', text: 'Recent search queries are stored exclusively in your browser\'s localStorage and are never transmitted to Packfolio or any third party.' },
                { label: 'Theme Preference', text: 'Your theme preference (light/dark) is stored in localStorage only.' },
                { label: 'Cookies', text: 'Packfolio does not set any cookies.' },
                { label: 'Analytics', text: 'Packfolio uses Vercel Analytics and Speed Insights for anonymous, aggregated performance telemetry. No personal data is collected. See Vercel\'s privacy policy for details.' },
              ].map(({ label, text }) => (
                <div key={label} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem' }}>
                  <span style={{ fontFamily: 'monospace', color: '#ef4444', flexShrink: 0, minWidth: '9rem' }}>{label}</span>
                  <span style={{ color: '#a3a3a3', lineHeight: 1.7 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 9. Disclaimer */}
        <Section number="09" title="Disclaimer of Warranties">
          <p style={styles.p}>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
            EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF 
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, OR NON-INFRINGEMENT.
          </p>
          <p style={styles.p}>
            Packfolio does not guarantee that the Service will be uninterrupted, error-free, or that 
            statistics will be current, accurate, or complete at any given time. Data accuracy is 
            contingent on npm's API availability and data pipeline integrity, which Packfolio 
            does not control.
          </p>
        </Section>

        {/* 10. Limitation of Liability */}
        <Section number="10" title="Limitation of Liability">
          <p style={styles.p}>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, PACKFOLIO AND ITS CREATOR SHALL NOT BE 
            LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES 
            (INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, BUSINESS DECISIONS MADE ON THE BASIS OF 
            STATISTICS, OR DATA LOSS) ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE, 
            EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
        </Section>

        {/* 11. Intellectual Property */}
        <Section number="11" title="Intellectual Property & Third-Party Rights">
          <p style={styles.p}>
            Packfolio is an independent project and is <strong>not affiliated with, endorsed by, 
            or sponsored by npm, Inc., GitHub, Inc., or Microsoft Corporation.</strong>
          </p>
          <p style={styles.p}>
            "npm" is a registered trademark of npm, Inc. All package names, descriptions, authorship 
            data, and download statistics are the property of their respective owners and are 
            reproduced here solely under npm's public API terms of service for informational purposes.
          </p>
          <p style={styles.p}>
            The Packfolio source code is released under the <strong>MIT License</strong> and is available 
            as an open-source project.
          </p>
        </Section>

        {/* 12. Changes to Service */}
        <Section number="12" title="Changes to the Service">
          <p style={styles.p}>
            Packfolio reserves the right to modify, suspend, or discontinue the Service at any time, 
            with or without notice. Packfolio shall not be liable to you or any third party for 
            any such modification, suspension, or discontinuation.
          </p>
        </Section>

        {/* 13. Contact */}
        <Section number="13" title="Contact">
          <p style={styles.p}>
            For questions, feedback, or legal inquiries regarding these Terms, please contact the 
            creator through the website below.
          </p>
          <div style={styles.card}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href="https://chemmangathari.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.85rem', color: '#ef4444', fontFamily: 'monospace', textDecoration: 'none' }}
              >
                chemmangathari.in
              </a>
            </div>
          </div>
        </Section>

        {/* ── Footer ── */}
        <footer style={{ borderTop: '1px solid #2a2a2a', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
            <p style={{ fontSize: '0.78rem', color: '#737373', fontFamily: 'monospace', textAlign: 'center' }}>
              Packfolio — Open source under the MIT License · Built for the npm community
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/" style={{ fontSize: '0.78rem', color: '#a3a3a3', fontFamily: 'monospace', textDecoration: 'none' }}>Dashboard</Link>
              <Link href="/about" style={{ fontSize: '0.78rem', color: '#a3a3a3', fontFamily: 'monospace', textDecoration: 'none' }}>About</Link>
              <a href="https://chemmangathari.in" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: '#a3a3a3', fontFamily: 'monospace', textDecoration: 'none' }}>chemmangathari.in</a>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}
