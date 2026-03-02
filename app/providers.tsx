'use client';

/**
 * Client-side Providers
 * 
 * Wraps client-only providers to prevent BAILOUT_TO_CLIENT_SIDE_RENDERING
 * in the root layout.
 */

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ThemeProvider } from '@/contexts/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AntdRegistry>{children}</AntdRegistry>
    </ThemeProvider>
  );
}
