import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['zh', 'en', 'ja'],
  defaultLocale: 'zh',
  localePrefix: 'always', // URL 始终包含语言前缀
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
