'use client';

/**
 * Client-side Providers
 * 
 * Wraps client-only providers to prevent BAILOUT_TO_CLIENT_SIDE_RENDERING
 * in the root layout. Uses StyleProvider for Ant Design SSR compatibility.
 */

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { StyleProvider } from '@ant-design/cssinjs';
import { ThemeProvider } from '@/contexts/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyleProvider hashPriority="high">
      <ThemeProvider>
        <AntdRegistry>{children}</AntdRegistry>
      </ThemeProvider>
    </StyleProvider>
  );
}
