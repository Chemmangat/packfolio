/**
 * About Page - Static content for SEO and AI crawlers
 * 
 * This page provides static HTML content that can be easily scraped
 * by AI tools and search engines. Fully server-side rendered.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import '../globals.css';

export const metadata: Metadata = {
  title: 'About PackFolio - npm Package Analytics Dashboard',
  description: 'Learn about PackFolio, a free npm package analytics dashboard for tracking download statistics and trends. Server-side rendered for optimal SEO and AI scraping.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#f5f5f5' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'monospace' }}>
            <span style={{ color: '#ef4444' }}>$</span> PackFolio
          </h1>
          <p className="text-xl mb-6" style={{ color: '#a3a3a3' }}>
            Free npm Package Analytics Dashboard
          </p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 rounded transition-colors"
            style={{ 
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontFamily: 'monospace',
              textDecoration: 'none'
            }}
          >
            Launch Dashboard →
          </Link>
        </div>

        {/* What is PackFolio */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'monospace' }}>
            What is PackFolio?
          </h2>
          <p className="leading-relaxed mb-4" style={{ color: '#a3a3a3' }}>
            PackFolio is a free, web-based analytics dashboard for npm packages. 
            It allows developers to track download statistics, analyze trends, and 
            compare packages without any registration or API keys required.
          </p>
          <p className="leading-relaxed" style={{ color: '#a3a3a3' }}>
            Simply search by npm username or package name to view comprehensive 
            download metrics including daily averages, weekly totals, monthly totals, 
            and all-time statistics with interactive charts.
          </p>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'monospace' }}>
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '🔍', title: 'Smart Search', desc: 'Search by npm username or package name with autocomplete suggestions' },
              { icon: '📊', title: 'Comprehensive Stats', desc: 'Daily, weekly, monthly, and all-time download metrics' },
              { icon: '📈', title: 'Interactive Charts', desc: 'Trend analysis, package comparison, and distribution visualization' },
              { icon: '🎨', title: 'Theme Support', desc: 'Light and dark mode with persistent preferences' },
              { icon: '📱', title: 'Fully Responsive', desc: 'Optimized for mobile, tablet, and desktop devices' },
              { icon: '🆓', title: 'Completely Free', desc: 'No registration, no API keys, no limits' },
            ].map((feature, idx) => (
              <div key={idx} className="rounded-lg p-6" style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a' }}>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'monospace' }}>
                  {feature.icon} {feature.title}
                </h3>
                <p className="text-sm" style={{ color: '#a3a3a3' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Use */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'monospace' }}>
            How to Use
          </h2>
          <div className="space-y-4">
            {[
              { num: '1', title: 'Search for Packages', desc: 'Enter an npm username (e.g., "sindresorhus") or package name (e.g., "react", "@babel/core")' },
              { num: '2', title: 'View Statistics', desc: 'See download metrics for individual packages and combined totals' },
              { num: '3', title: 'Analyze Trends', desc: 'Use interactive charts to visualize trends, compare packages, and view distribution' },
              { num: '4', title: 'Load More', desc: 'Click "Load More" to fetch additional packages (loads 10 at a time)' },
            ].map((step, idx) => (
              <div key={idx} className="rounded-lg p-6" style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a' }}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#ef4444', color: '#ffffff', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ fontFamily: 'monospace' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm" style={{ color: '#a3a3a3' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'monospace' }}>
            Use Cases
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'monospace' }}>
                For Developers
              </h3>
              <ul className="list-disc list-inside space-y-2" style={{ color: '#a3a3a3' }}>
                <li>Track your package adoption and growth</li>
                <li>Compare your packages with competitors</li>
                <li>Identify trending packages in your niche</li>
                <li>Monitor package health and popularity</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'monospace' }}>
                For Teams
              </h3>
              <ul className="list-disc list-inside space-y-2" style={{ color: '#a3a3a3' }}>
                <li>Evaluate package popularity before adoption</li>
                <li>Track dependencies download trends</li>
                <li>Make data-driven decisions on package selection</li>
                <li>Monitor ecosystem health</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'monospace' }}>
                For Researchers
              </h3>
              <ul className="list-disc list-inside space-y-2" style={{ color: '#a3a3a3' }}>
                <li>Analyze npm ecosystem trends</li>
                <li>Study package adoption patterns</li>
                <li>Research open source sustainability</li>
                <li>Gather data for academic studies</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'monospace' }}>
            Technology Stack
          </h2>
          <div className="rounded-lg p-6" style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a' }}>
            <ul className="space-y-2" style={{ color: '#a3a3a3' }}>
              <li><span style={{ color: '#f5f5f5', fontFamily: 'monospace' }}>Framework:</span> Next.js 15 (React 19)</li>
              <li><span style={{ color: '#f5f5f5', fontFamily: 'monospace' }}>Language:</span> TypeScript</li>
              <li><span style={{ color: '#f5f5f5', fontFamily: 'monospace' }}>Styling:</span> Tailwind CSS</li>
              <li><span style={{ color: '#f5f5f5', fontFamily: 'monospace' }}>UI Components:</span> Ant Design</li>
              <li><span style={{ color: '#f5f5f5', fontFamily: 'monospace' }}>Charts:</span> Recharts</li>
              <li><span style={{ color: '#f5f5f5', fontFamily: 'monospace' }}>Analytics:</span> Vercel Analytics & Speed Insights</li>
              <li><span style={{ color: '#f5f5f5', fontFamily: 'monospace' }}>Data Source:</span> npm Registry API & npm Downloads API</li>
            </ul>
          </div>
        </section>

        {/* Popular Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'monospace' }}>
            Try These Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { code: 'sindresorhus', desc: 'Prolific open source developer' },
              { code: 'react', desc: 'React library and ecosystem' },
              { code: '@babel/core', desc: 'Babel JavaScript compiler' },
            ].map((example, idx) => (
              <div key={idx} className="rounded-lg p-4" style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a' }}>
                <code style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  {example.code}
                </code>
                <p className="text-xs mt-2" style={{ color: '#737373' }}>
                  {example.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #2a2a2a', paddingTop: '2rem', marginTop: '3rem' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: '#737373', fontFamily: 'monospace' }}>
              Built with ❤️ for the npm community
            </p>
            <div className="flex gap-4">
              <Link 
                href="/" 
                className="text-sm transition-colors" 
                style={{ color: '#a3a3a3', fontFamily: 'monospace', textDecoration: 'none' }}
              >
                Dashboard
              </Link>
              <a 
                href="https://chemmangathari.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm transition-colors"
                style={{ color: '#a3a3a3', fontFamily: 'monospace', textDecoration: 'none' }}
              >
                Maintained by chemmangathari.in
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
