import '../index.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Mala Leche | Web Studio - Desarrollo Web Premium',
  description: 'En The Mala Leche somos un estudio experto en desarrollo y diseño web. Creamos sitios rápidos y aplicaciones a la medida usando Next.js, Supabase y TypeScript.',
  keywords: 'paginas web, diseño web, desarrollo web a medida, react, supabase, nextjs, typescript, the mala leche',
  authors: [{ name: 'The Mala Leche' }],
  metadataBase: new URL('https://themalaleche.com'),
  openGraph: {
    type: 'website',
    url: 'https://themalaleche.com',
    title: 'The Mala Leche | Web Studio - Desarrollo Web Premium',
    description: 'En The Mala Leche somos un estudio experto en desarrollo y diseño web. Creamos sitios rápidos y aplicaciones a la medida usando Next.js, Supabase y TypeScript.',
    siteName: 'The Mala Leche',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'The Mala Leche Web Studio',
    }],
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@themalaleche',
    title: 'The Mala Leche | Web Studio - Desarrollo Web Premium',
    description: 'En The Mala Leche somos un estudio experto en desarrollo y diseño web.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
