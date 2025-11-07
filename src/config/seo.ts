/**
 * SEO 配置
 * 定义网站的基础 SEO 设置和多语言支持
 */

import type { Locale } from '@/i18n/config';

export const seoConfig = {
  // 默认标题
  defaultTitle: 'AiCoder',
  
  // 标题模板
  titleTemplate: '%s | AiCoder',
  
  // 默认描述
  defaultDescription: 'Professional AI-powered coding assistant platform',
  
  // 网站 URL
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://aicoder.com',
  
  // 支持的语言
  locales: ['zh', 'en', 'ja'] as const,
  
  // 默认语言
  defaultLocale: 'zh' as Locale,
  
  // Open Graph 默认配置
  openGraph: {
    type: 'website',
    siteName: 'AiCoder',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AiCoder - AI Coding Assistant',
      },
    ],
  },
  
  // Twitter Card 默认配置
  twitter: {
    card: 'summary_large_image',
    site: '@aicoder',
    creator: '@aicoder',
  },
} as const;
