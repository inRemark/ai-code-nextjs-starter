import { createPageMetadataGenerator } from '@/lib/seo';
import { AboutPageContent } from '@/features/about/components/about-page-content';

export const generateMetadata = createPageMetadataGenerator('about');

export default function AboutPage() {
  return <AboutPageContent />;
}