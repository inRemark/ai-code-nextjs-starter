import { createPageMetadataGenerator } from '@/lib/seo';
import { AboutPageContent } from '@/features/about/components/about-page-content';

// 生成多语言 SEO metadata
export const generateMetadata = createPageMetadataGenerator('about');

export default function AboutPage() {
  return <AboutPageContent />;
}