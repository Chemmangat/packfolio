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
  title: "PackFolio - npm Package Analytics Dashboard",
  description: "Free npm package analytics dashboard. Track download statistics, trends, and compare packages. Search by username or package name to view daily, weekly, monthly, and all-time download metrics with interactive charts.",
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
    "npm package tracker"
  ],
  authors: [{ name: "PackFolio" }],
  creator: "PackFolio",
  publisher: "PackFolio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.packfolio.dev",
    title: "PackFolio - npm Package Analytics Dashboard",
    description: "Free npm package analytics dashboard. Track download statistics, trends, and compare packages with interactive charts.",
    siteName: "PackFolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "PackFolio - npm Package Analytics Dashboard",
    description: "Free npm package analytics dashboard. Track download statistics, trends, and compare packages.",
  },
  applicationName: "PackFolio",
  category: "Developer Tools",
  alternates: {
    canonical: "https://www.packfolio.dev",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.packfolio.dev" />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
