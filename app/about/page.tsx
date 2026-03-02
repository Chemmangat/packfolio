/**
 * About Page - Fully Server-Side Rendered
 * 
 * This page is a pure Server Component with zero client-side dependencies.
 * All content is rendered in the initial HTML response for optimal AI scraping.
 * 
 * NO "use client" directive
 * NO React hooks (useState, useEffect, etc.)
 * NO dynamic imports with ssr: false
 */

import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'About PackFolio - npm Package Analytics Dashboard',
  description: 'Learn about PackFolio, a free npm package analytics dashboard for tracking download statistics and trends. Server-side rendered for optimal SEO and AI scraping.',
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
    title: 'About PackFolio - npm Package Analytics Dashboard',
    description: 'Learn about PackFolio, a free npm package analytics dashboard for tracking download statistics and trends.',
  },
  alternates: {
    canonical: 'https://www.packfolio.dev/about',
  },
};

// Structured Data for AI Crawlers
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "About PackFolio",
  "description": "Free npm package analytics dashboard for tracking download statistics and trends.",
  "url": "https://www.packfolio.dev/about",
  "author": {
    "@type": "Person",
    "name": "Hari C M",
    "url": "https://chemmangathari.in"
  },
  "isPartOf": {
    "@type": "WebApplication",
    "name": "PackFolio",
    "url": "https://www.packfolio.dev",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "author": {
      "@type": "Person",
      "name": "Hari C M",
      "url": "https://chemmangathari.in"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "npm package search by username or package name",
      "Real-time download statistics (daily, weekly, monthly, all-time)",
      "Interactive trend charts with multiple time ranges",
      "Package comparison across multiple packages",
      "Download distribution visualization",
      "Light and dark theme support",
      "Mobile-responsive design",
      "Free to use with no registration required"
    ]
  }
};

export default function AboutPage() {
  return (
    <>
      {/* Structured Data JSON-LD */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        strategy="beforeInteractive"
      />

      <main style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#f5f5f5' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
          {/* Header */}
          <header style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace' }}>
              <span style={{ color: '#ef4444' }}>$</span> PackFolio
            </h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#a3a3a3' }}>
              Free npm Package Analytics Dashboard
            </p>
            <Link 
              href="/"
              style={{ 
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                borderRadius: '0.375rem',
                fontFamily: 'monospace',
                textDecoration: 'none'
              }}
            >
              Launch Dashboard →
            </Link>
          </header>

          {/* What is PackFolio */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace' }}>
              What is PackFolio?
            </h2>
            <p style={{ lineHeight: '1.75', marginBottom: '1rem', color: '#a3a3a3' }}>
              PackFolio is a free, web-based analytics dashboard for npm packages. 
              It allows developers to track download statistics, analyze trends, and 
              compare packages without any registration or API keys required.
            </p>
            <p style={{ lineHeight: '1.75', color: '#a3a3a3' }}>
              Simply search by npm username or package name to view comprehensive 
              download metrics including daily averages, weekly totals, monthly totals, 
              and all-time statistics with interactive charts.
            </p>
          </section>

          {/* Key Features */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace' }}>
              Key Features
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                  🔍 Smart Search
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>
                  Search by npm username or package name with autocomplete suggestions
                </p>
              </div>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                  📊 Comprehensive Stats
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>
                  Daily, weekly, monthly, and all-time download metrics
                </p>
              </div>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                  📈 Interactive Charts
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>
                  Trend analysis, package comparison, and distribution visualization
                </p>
              </div>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                  🎨 Theme Support
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>
                  Light and dark mode with persistent preferences
                </p>
              </div>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                  📱 Fully Responsive
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>
                  Optimized for mobile, tablet, and desktop devices
                </p>
              </div>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                  🆓 Completely Free
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>
                  No registration, no API keys, no limits
                </p>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace' }}>
              How to Use
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flexShrink: 0, width: '2rem', height: '2rem', backgroundColor: '#ef4444', color: '#ffffff', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    1
                  </div>
                  <div>
                    <h3 style={{ fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                      Search for Packages
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>
                      Enter an npm username (e.g., "sindresorhus") or package name (e.g., "react", "@babel/core")
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flexShrink: 0, width: '2rem', height: '2rem', backgroundColor: '#ef4444', color: '#ffffff', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    2
                  </div>
                  <div>
                    <h3 style={{ fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                      View Statistics
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>
                      See download metrics for individual packages and combined totals
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flexShrink: 0, width: '2rem', height: '2rem', backgroundColor: '#ef4444', color: '#ffffff', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    3
                  </div>
                  <div>
                    <h3 style={{ fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                      Analyze Trends
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>
                      Use interactive charts to visualize trends, compare packages, and view distribution
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flexShrink: 0, width: '2rem', height: '2rem', backgroundColor: '#ef4444', color: '#ffffff', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    4
                  </div>
                  <div>
                    <h3 style={{ fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                      Load More
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#a3a3a3' }}>
                      Click "Load More" to fetch additional packages (loads 10 at a time)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace' }}>
              Use Cases
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                  For Developers
                </h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#a3a3a3' }}>
                  <li>Track your package adoption and growth</li>
                  <li>Compare your packages with competitors</li>
                  <li>Identify trending packages in your niche</li>
                  <li>Monitor package health and popularity</li>
                </ul>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                  For Teams
                </h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#a3a3a3' }}>
                  <li>Evaluate package popularity before adoption</li>
                  <li>Track dependencies download trends</li>
                  <li>Make data-driven decisions on package selection</li>
                  <li>Monitor ecosystem health</li>
                </ul>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                  For Researchers
                </h3>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#a3a3a3' }}>
                  <li>Analyze npm ecosystem trends</li>
                  <li>Study package adoption patterns</li>
                  <li>Research open source sustainability</li>
                  <li>Gather data for academic studies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace' }}>
              Technology Stack
            </h2>
            <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1.5rem' }}>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#a3a3a3' }}>
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
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace' }}>
              Try These Examples
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1rem' }}>
                <code style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  sindresorhus
                </code>
                <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#737373' }}>
                  Prolific open source developer
                </p>
              </div>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1rem' }}>
                <code style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  react
                </code>
                <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#737373' }}>
                  React library and ecosystem
                </p>
              </div>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1rem' }}>
                <code style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  @babel/core
                </code>
                <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#737373' }}>
                  Babel JavaScript compiler
                </p>
              </div>
            </div>
          </section>

          {/* About the Creator */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', fontFamily: 'monospace' }}>
              About the Creator
            </h2>
            <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', fontFamily: 'monospace', color: '#f5f5f5' }}>
                    Hari C M
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#a3a3a3', lineHeight: '1.75' }}>
                    PackFolio was built by Hari C M, a developer passionate about creating tools that make developers' lives easier. 
                    This project was born from the need to quickly evaluate npm packages without juggling multiple tabs and data sources.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem' }}>
                  <a 
                    href="https://chemmangathari.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      borderRadius: '0.375rem',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      textDecoration: 'none'
                    }}
                  >
                    🌐 Visit Website
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer style={{ borderTop: '1px solid #2a2a2a', paddingTop: '2rem', marginTop: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#737373', fontFamily: 'monospace' }}>
                Built with ❤️ for the npm community by Hari C M
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link 
                  href="/" 
                  style={{ fontSize: '0.875rem', color: '#a3a3a3', fontFamily: 'monospace', textDecoration: 'none' }}
                >
                  Dashboard
                </Link>
                <a 
                  href="https://chemmangathari.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.875rem', color: '#a3a3a3', fontFamily: 'monospace', textDecoration: 'none' }}
                >
                  chemmangathari.in
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
