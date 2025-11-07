/**
 * SEO 工具函数
 * 用于生成多语言的 metadata
 */

import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { seoConfig } from '@/config/seo';

interface PageSeoMessages {
  title: string;
  description: string;
  keywords?: string;
}

interface LocalizedMetadataOptions {
  locale: Locale;
  page: string;
  messages: {
    seo?: {
      [key: string]: PageSeoMessages;
    };
  };
  path?: string;
}

/**
 * 生成多语言 metadata
 */
export function generateLocalizedMetadata({
  locale,
  page,
  messages,
  path = '',
}: LocalizedMetadataOptions): Metadata {
  const seoMessages = messages.seo?.[page];
  
  if (!seoMessages) {
    console.warn(`SEO messages not found for page: ${page}`);
    return {};
  }

  const { title, description, keywords } = seoMessages;
  const baseUrl = seoConfig.siteUrl;
  const currentUrl = `${baseUrl}/${locale}${path}`;

  // 生成 hreflang 链接
  const languages = seoConfig.locales.reduce(
    (acc, lang) => {
      acc[lang] = `${baseUrl}/${lang}${path}`;
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    title,
    description,
    keywords: keywords?.split(',').map((k) => k.trim()),
    
    // Canonical URL
    alternates: {
      canonical: currentUrl,
      languages: {
        ...languages,
        'x-default': `${baseUrl}/${seoConfig.defaultLocale}${path}`,
      },
    },

    // Open Graph
    openGraph: {
      title,
      description,
      url: currentUrl,
      locale,
      type: 'website',
      siteName: seoConfig.openGraph.siteName,
      images: seoConfig.openGraph.images.map((img) => ({
        ...img,
        url: `${baseUrl}${img.url}`,
      })),
    },

    // Twitter Card
    twitter: {
      card: seoConfig.twitter.card,
      title,
      description,
      site: seoConfig.twitter.site,
      creator: seoConfig.twitter.creator,
      images: seoConfig.openGraph.images.map((img) => `${baseUrl}${img.url}`),
    },

    // 其他元标签
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * 生成简化版 metadata（用于不需要完整 SEO 的页面）
 */
export function generateSimpleMetadata(
  title: string,
  description: string,
  locale: Locale
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale,
      type: 'website',
    },
  };
}
