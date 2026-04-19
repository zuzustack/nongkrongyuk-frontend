import type { ReactNode } from 'react';
import ReactQueryProvider from '@/src/providers/ReactQuery';
import './globals.css';

export const metadata = {
  title: 'NongkrongYuk — Temukan Tempat Nongkrong Terbaik',
  description: 'Aplikasi peta interaktif untuk menemukan cafe, restoran, coworking space, dan tempat nongkrong terbaik di sekitarmu.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}