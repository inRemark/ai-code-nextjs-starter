import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Feature modules list
const FEATURE_MODULES = ['shared-layout', 'auth', 'home', 'about', 
  'pricing', 'blog', 'help', 'articles', 
  'console', 'user', 'admin', 'mail'];

// Dynamically load feature-level translations and merge with base messages
async function loadFeatureMessages(locale: string) {
  const baseMessages = (await import(`@/messages/${locale}.json`)).default;
  const mergedMessages = { ...baseMessages };

  // Dynamically load each feature's translations
  for (const feature of FEATURE_MODULES) {
    try {
      const featureMessages = (await import(`@/features/${feature}/locale/${locale}.json`)).default;
      mergedMessages[feature] = featureMessages;
    } catch {
      // If feature translations do not exist, skip (may be optional feature)
      console.warn(`Feature messages not found for ${feature}/${locale}`);
    }
  }

  return mergedMessages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the requested locale
  let locale = await requestLocale;

  // Validate the locale
  if (!locale || !routing.locales.includes(locale as 'zh' | 'en' | 'ja')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await loadFeatureMessages(locale),
  };
});
