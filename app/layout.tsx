/**
 * Root Layout
 * 
 * Wraps the entire application with necessary providers.
 */

import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { config } from '@/lib/config';
import "./globals.css";

export const metadata: Metadata = {
  title: "PackFolio",
  description: "Technical npm package analytics dashboard - Track download statistics and trends for npm packages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
