import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const SITE_NAME = 'Gabaritaê ENEM';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — provas oficiais comentadas`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    'Provas oficiais do ENEM com resolução comentada, teoria por área e simulados personalizados. Estude de graça, do seu jeito.',
  applicationName: SITE_NAME,
  keywords: [
    'ENEM',
    'provas do ENEM',
    'questões comentadas',
    'simulado ENEM',
    'teoria ENEM',
    'caderno azul',
    'caderno amarelo',
    'estudos',
  ],
  authors: [{ name: 'Gabaritaê' }],
  category: 'education',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — provas oficiais comentadas`,
    description:
      'Provas oficiais do ENEM com resolução comentada, teoria por área e simulados personalizados.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — provas oficiais comentadas`,
    description:
      'Provas oficiais do ENEM com resolução comentada, teoria por área e simulados personalizados.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
