import type { MetadataRoute } from 'next';

import { officialExams } from '@/data/catalog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/+$/, '');

  const staticPaths = ['/', '/provas', '/entrar', '/criar-conta'];

  return [
    ...staticPaths.map((path) => ({ url: `${base}${path}` })),
    ...officialExams.map((exam) => ({ url: `${base}/provas/${exam.id}` })),
  ];
}
