import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Feature 目录列表 - 维护需要加载的 feature 翻译
const FEATURE_MODULES = ['auth', 'home', 'about', 'blog', 'help', 'articles', 'console', 'user', 'admin', 'mail'];

// 动态加载 feature 级翻译并合并
async function loadFeatureMessages(locale: string) {
  const baseMessages = (await import(`@/messages/${locale}.json`)).default;
  const mergedMessages = { ...baseMessages };

  // 动态加载每个 feature 的翻译
  for (const feature of FEATURE_MODULES) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const featureMessages = (await import(`@/features/${feature}/locale/${locale}.json`)).default;
      mergedMessages[feature] = featureMessages;
    } catch {
      // 如果 feature 翻译不存在，跳过（可能是可选 feature）
      // eslint-disable-next-line no-console
      console.warn(`Feature messages not found for ${feature}/${locale}`);
    }
  }

  return mergedMessages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // 获取请求的 locale
  let locale = await requestLocale;

  // 验证 locale 是否有效
  if (!locale || !routing.locales.includes(locale as 'zh' | 'en' | 'ja')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await loadFeatureMessages(locale),
  };
});
