/**
 * About Page Layout
 * 
 * Separate layout for the About page that bypasses the root layout's
 * client-side ThemeProvider, ensuring full server-side rendering.
 */

import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "../globals.css";

export const metadata: Metadata = {
  title: "About PackFolio - npm Package Analytics Dashboard",
  description: "Learn about PackFolio, a free npm package analytics dashboard for tracking download statistics and trends. Server-side rendered for optimal SEO and AI scraping.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://packfolio.vercel.app/about" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
