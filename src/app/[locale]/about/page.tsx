import type { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import { generateLocalizedMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/config';
import { AboutPageContent } from '@/features/about/components/about-page-content';

// 生成多语言 SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();

  return generateLocalizedMetadata({
    locale: locale as Locale,
    page: 'about',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: messages as any,
    path: '/about',
  });
}

export default function AboutPage() {
  return <AboutPageContent />;
}