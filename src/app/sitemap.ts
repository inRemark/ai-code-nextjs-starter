import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

  // Define all routes that need to be included in the sitemap
  const routes = [
    '',
    '/about',
    '/about/privacy',
    '/about/terms',
    '/about/cookies',
    '/blog',
    '/help',
    '/pricing',
    '/articles',
    '/auth/login',
    '/auth/register',
  ];

  // generate sitemap entries
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of routes) {
      const url = `${baseUrl}/${locale}${route}`;
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: routing.locales.reduce(
            (acc, lang) => {
              acc[lang] = `${baseUrl}/${lang}${route}`;
              return acc;
            },
            {} as Record<'zh' | 'en' | 'ja', string>
          ),
        },
      });
    }
  }

  return sitemapEntries;
}
