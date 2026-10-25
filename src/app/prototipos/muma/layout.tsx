import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import './muma.css';

const display = localFont({
  src: [
    { path: './fonts/montserrat-latin-800-normal.woff2', weight: '800' },
    { path: './fonts/montserrat-latin-900-normal.woff2', weight: '900' },
  ],
  variable: '--muma-display',
  display: 'swap',
});
const body = localFont({
  src: [
    { path: './fonts/dm-sans-latin-300-normal.woff2', weight: '300' },
    { path: './fonts/dm-sans-latin-400-normal.woff2', weight: '400' },
    { path: './fonts/dm-sans-latin-500-normal.woff2', weight: '500' },
  ],
  variable: '--muma-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MUMA Creative House · Prototipo',
  robots: { index: false, follow: false },
};

export default function MumaLayout({ children }: { children: ReactNode }) {
  return <div className={`muma ${display.variable} ${body.variable}`}>{children}</div>;
}
