import type { ReactNode } from 'react';
import ReactQueryProvider from '@/src/providers/ReactQuery';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}