/**
 * About Page - Static content for SEO and AI crawlers
 * 
 * This page provides static HTML content that can be easily scraped
 * by AI tools and search engines.
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About PackFolio - npm Package Analytics Dashboard',
  description: 'Learn about PackFolio, a free npm package analytics dashboard for tracking download statistics and trends.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-primary text-primary">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold font-mono mb-4">
            <span className="text-accent-primary">$</span> PackFolio
          </h1>
          <p className="text-xl text-secondary">
            Free npm Package Analytics Dashboard
          </p>
          <div className="mt-6">
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-accent-primary hover:bg-accent-secondary text-white rounded font-mono transition-colors"
            >
              Launch Dashboard →
            </Link>
          </div>
        </div>

        {/* What is PackFolio */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-mono mb-4 text-primary">What is PackFolio?</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-secondary leading-relaxed mb-4">
              PackFolio is a free, web-based analytics dashboard for npm packages. 
              It allows developers to track download statistics, analyze trends, and 
              compare packages without any registration or API keys required.
            </p>
            <p className="text-secondary leading-relaxed">
              Simply search by npm username or package name to view comprehensive 
              download metrics including daily averages, weekly totals, monthly totals, 
              and all-time statistics with interactive charts.
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-mono mb-4 text-primary">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-primary rounded-lg p-6">
              <h3 className="text-lg font-mono font-semibold mb-2 text-primary">🔍 Smart Search</h3>
              <p className="text-sm text-secondary">
                Search by npm username or package name with autocomplete suggestions
              </p>
            </div>
            <div className="bg-card border border-primary rounded-lg p-6">
              <h3 className="text-lg font-mono font-semibold mb-2 text-primary">📊 Comprehensive Stats</h3>
              <p className="text-sm text-secondary">
                Daily, weekly, monthly, and all-time download metrics
              </p>
            </div>
            <div className="bg-card border border-primary rounded-lg p-6">
              <h3 className="text-lg font-mono font-semibold mb-2 text-primary">📈 Interactive Charts</h3>
              <p className="text-sm text-secondary">
                Trend analysis, package comparison, and distribution visualization
              </p>
            </div>
            <div className="bg-card border border-primary rounded-lg p-6">
              <h3 className="text-lg font-mono font-semibold mb-2 text-primary">🎨 Theme Support</h3>
              <p className="text-sm text-secondary">
                Light and dark mode with persistent preferences
              </p>
            </div>
            <div className="bg-card border border-primary rounded-lg p-6">
              <h3 className="text-lg font-mono font-semibold mb-2 text-primary">📱 Fully Responsive</h3>
              <p className="text-sm text-secondary">
                Optimized for mobile, tablet, and desktop devices
              </p>
            </div>
            <div className="bg-card border border-primary rounded-lg p-6">
              <h3 className="text-lg font-mono font-semibold mb-2 text-primary">🆓 Completely Free</h3>
              <p className="text-sm text-secondary">
                No registration, no API keys, no limits
              </p>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-mono mb-4 text-primary">How to Use</h2>
          <div className="space-y-4">
            <div className="bg-card border border-primary rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-primary text-white rounded-full flex items-center justify-center font-mono font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-mono font-semibold mb-2 text-primary">Search for Packages</h3>
                  <p className="text-sm text-secondary">
                    Enter an npm username (e.g., "sindresorhus") or package name (e.g., "react", "@babel/core")
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-primary rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-primary text-white rounded-full flex items-center justify-center font-mono font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-mono font-semibold mb-2 text-primary">View Statistics</h3>
                  <p className="text-sm text-secondary">
                    See download metrics for individual packages and combined totals
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-primary rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-primary text-white rounded-full flex items-center justify-center font-mono font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-mono font-semibold mb-2 text-primary">Analyze Trends</h3>
                  <p className="text-sm text-secondary">
                    Use interactive charts to visualize trends, compare packages, and view distribution
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-primary rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-primary text-white rounded-full flex items-center justify-center font-mono font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-mono font-semibold mb-2 text-primary">Load More</h3>
                  <p className="text-sm text-secondary">
                    Click "Load More" to fetch additional packages (loads 10 at a time)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-mono mb-4 text-primary">Use Cases</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-mono font-semibold mb-2 text-primary">For Developers</h3>
              <ul className="list-disc list-inside space-y-2 text-secondary">
                <li>Track your package adoption and growth</li>
                <li>Compare your packages with competitors</li>
                <li>Identify trending packages in your niche</li>
                <li>Monitor package health and popularity</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-mono font-semibold mb-2 text-primary">For Teams</h3>
              <ul className="list-disc list-inside space-y-2 text-secondary">
                <li>Evaluate package popularity before adoption</li>
                <li>Track dependencies download trends</li>
                <li>Make data-driven decisions on package selection</li>
                <li>Monitor ecosystem health</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-mono font-semibold mb-2 text-primary">For Researchers</h3>
              <ul className="list-disc list-inside space-y-2 text-secondary">
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
          <h2 className="text-2xl font-bold font-mono mb-4 text-primary">Technology Stack</h2>
          <div className="bg-card border border-primary rounded-lg p-6">
            <ul className="space-y-2 text-secondary">
              <li><span className="text-primary font-mono">Framework:</span> Next.js 15 (React 19)</li>
              <li><span className="text-primary font-mono">Language:</span> TypeScript</li>
              <li><span className="text-primary font-mono">Styling:</span> Tailwind CSS</li>
              <li><span className="text-primary font-mono">UI Components:</span> Ant Design</li>
              <li><span className="text-primary font-mono">Charts:</span> Recharts</li>
              <li><span className="text-primary font-mono">Analytics:</span> Vercel Analytics & Speed Insights</li>
              <li><span className="text-primary font-mono">Data Source:</span> npm Registry API & npm Downloads API</li>
            </ul>
          </div>
        </section>

        {/* Popular Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-mono mb-4 text-primary">Try These Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-primary rounded-lg p-4">
              <code className="text-accent-primary font-mono text-sm">sindresorhus</code>
              <p className="text-xs text-tertiary mt-2">Prolific open source developer</p>
            </div>
            <div className="bg-card border border-primary rounded-lg p-4">
              <code className="text-accent-primary font-mono text-sm">react</code>
              <p className="text-xs text-tertiary mt-2">React library and ecosystem</p>
            </div>
            <div className="bg-card border border-primary rounded-lg p-4">
              <code className="text-accent-primary font-mono text-sm">@babel/core</code>
              <p className="text-xs text-tertiary mt-2">Babel JavaScript compiler</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-primary pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-tertiary font-mono">
              Built with ❤️ for the npm community
            </p>
            <div className="flex gap-4">
              <Link href="/" className="text-sm text-secondary hover:text-primary font-mono transition-colors">
                Dashboard
              </Link>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-secondary hover:text-primary font-mono transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
