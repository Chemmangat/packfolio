/**
 * Root Layout
 * 
 * Wraps the entire application with necessary providers.
 */

import type { Metadata } from "next";
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://packfolio.vercel.app'),
  title: {
    default: "PackFolio - npm Package Analytics Dashboard",
    template: "%s | PackFolio"
  },
  description: "Free npm package analytics dashboard with health scores, trending detection, and developer leaderboards. Track download statistics, analyze trends, and compare packages with interactive charts. Search by username or package name.",
  keywords: [
    "npm analytics",
    "package statistics",
    "npm downloads",
    "package metrics",
    "npm dashboard",
    "package analytics",
    "npm trends",
    "download statistics",
    "package comparison",
    "npm package tracker",
    "npm health score",
    "package trending",
    "developer leaderboard",
    "npm heatmap",
    "package timeline",
    "npm charts",
    "package insights",
    "npm statistics",
    "package downloads",
    "npm registry analytics"
  ],
  authors: [{ name: "PackFolio", url: "https://packfolio.vercel.app" }],
  creator: "PackFolio",
  publisher: "PackFolio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://packfolio.vercel.app",
    title: "PackFolio - npm Package Analytics Dashboard",
    description: "Free npm package analytics dashboard with health scores, trending detection, and developer leaderboards. Track downloads, analyze trends, compare packages.",
    siteName: "PackFolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PackFolio - npm Package Analytics Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PackFolio - npm Package Analytics Dashboard",
    description: "Free npm package analytics dashboard. Track downloads, analyze trends, compare packages with interactive charts.",
    images: ["/og-image.png"],
    creator: "@packfolio",
  },
  applicationName: "PackFolio",
  category: "Developer Tools",
  classification: "Web Application",
  alternates: {
    canonical: "https://packfolio.vercel.app",
  },
  verification: {
    google: "t_PXtjT_mlcR7FJwXRFY1pMLUyGuGwHBBaWa9nx560E",
  },
  other: {
    "google-site-verification": "t_PXtjT_mlcR7FJwXRFY1pMLUyGuGwHBBaWa9nx560E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ef4444" />
        <meta name="google-site-verification" content="t_PXtjT_mlcR7FJwXRFY1pMLUyGuGwHBBaWa9nx560E" />
        <link rel="canonical" href="https://packfolio.vercel.app" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://registry.npmjs.org" />
        <link rel="preconnect" href="https://api.npmjs.org" />
        
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "PackFolio",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Free npm package analytics dashboard with health scores, trending detection, and developer leaderboards. Track download statistics, analyze trends, and compare packages with interactive charts.",
              "url": "https://packfolio.vercel.app",
              "screenshot": "https://packfolio.vercel.app/screenshot.png",
              "featureList": [
                "Package Health Score (0-100 scoring)",
                "Real-time Trending Detection",
                "Developer Leaderboard & Impact Score",
                "Download Heatmap Calendar",
                "Package Timeline & Milestones",
                "Interactive Charts & Comparisons",
                "GitHub Stars Integration",
                "Search by Username or Package"
              ],
              "softwareVersion": "2.0.0",
              "author": {
                "@type": "Organization",
                "name": "PackFolio"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "ratingCount": "1"
              }
            })
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
